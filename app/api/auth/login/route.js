import { NextResponse } from 'next/server';

// Helper function to extract string between two delimiters
function getBetween(start, end, text) {
  try {
    const startIndex = text.indexOf(start);
    if (startIndex === -1) return '';
    
    const afterStart = text.substring(startIndex + start.length);
    const endIndex = afterStart.indexOf(end);
    if (endIndex === -1) return afterStart;
    
    return afterStart.substring(0, endIndex);
  } catch (error) {
    return '';
  }
}

// Function to authenticate with UB SSO
async function authUBNoEmail(username, password) {
  try {
    // First request to get session cookies
    const firstResponse = await fetch('https://brone.ub.ac.id/my/', {
      method: 'GET',
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9,id;q=0.8',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'priority': 'u=0, i',
        'referer': 'https://brone.ub.ac.id/',
        'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
    });

    const firstResponseText = await firstResponse.text();
    const setCookieHeader = firstResponse.headers.get('set-cookie') || '';

    // Extract session cookies
    const authSessionID = getBetween('AUTH_SESSION_ID=', ';', setCookieHeader);
    const authSessionIDLegacy = getBetween('AUTH_SESSION_ID_LEGACY=', ';', setCookieHeader);
    const kcRestart = getBetween('KC_RESTART=', ';', setCookieHeader);

    // Extract form action URL and parameters
    const fullURL = getBetween('action="', '" ', firstResponseText);
    if (!fullURL) {
      throw new Error('Could not find login form URL');
    }

    const sessionCode = getBetween('session_code=', '&amp', fullURL);
    const execution = getBetween('execution=', '&amp', fullURL);
    const tabID = fullURL.split('tab_id=')[1];

    // Prepare login data
    const loginData = new URLSearchParams({
      username: username,
      password: password,
      credentialId: ''
    });

    // Login request
    const loginUrl = `https://iam.ub.ac.id/auth/realms/ub/login-actions/authenticate?session_code=${sessionCode}&execution=${execution}&client_id=brone.ub.ac.id&tab_id=${tabID}`;
    
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9,id;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'null',
        'pragma': 'no-cache',
        'priority': 'u=0, i',
        'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'cookie': `AUTH_SESSION_ID=${authSessionID}; AUTH_SESSION_ID_LEGACY=${authSessionIDLegacy}; KC_RESTART=${kcRestart}`
      },
      body: loginData,
    });

    const loginResponseText = await loginResponse.text();

    // Check for login errors
    if (!loginResponseText.includes('SAMLResponse')) {
      if (loginResponseText.includes('Invalid username or password.')) {
        return {
          success: false,
          code: 401,
          message: 'Invalid username or password'
        };
      } else {
        return {
          success: false,
          code: 500,
          message: 'Unexpected error during authentication'
        };
      }
    }

    // Extract SAML response
    const samlResponse = getBetween('name="SAMLResponse" value="', '"/>', loginResponseText);
    if (!samlResponse) {
      throw new Error('Could not extract SAML response');
    }

    // Decode SAML response
    const decodedSamlResponse = Buffer.from(samlResponse, 'base64').toString('utf-8');

    // Parse student details from SAML response
    const nim = getBetween(
      '<saml:Attribute FriendlyName="nim" Name="nim" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">',
      '</saml',
      decodedSamlResponse
    );

    const fullName = getBetween(
      '<saml:Attribute FriendlyName="fullName" Name="fullName" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">',
      '</saml',
      decodedSamlResponse
    );

    const fakultasRaw = getBetween(
      '<saml:Attribute FriendlyName="fakultas" Name="fakultas" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">',
      '</saml',
      decodedSamlResponse
    );

    const fakultas = fakultasRaw ? `Fakultas ${fakultasRaw}` : '';

    const programStudi = getBetween(
      '<saml:Attribute FriendlyName="prodi" Name="prodi" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xs:string">',
      '</saml',
      decodedSamlResponse
    );

    return {
      success: true,
      data: {
        nim,
        fullName,
        email: 'missing email from ub',
        fakultas,
        programStudi
      }
    };

  } catch (error) {
    console.error('Auth error:', error);
    return {
      success: false,
      code: 500,
      message: 'Internal server error during authentication'
    };
  }
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username and password are required' 
        },
        { status: 400 }
      );
    }

    const authResult = await authUBNoEmail(username, password);

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message
        },
        { status: authResult.code || 500 }
      );
    }

    // Create session token (in production, use proper JWT or session management)
    const sessionToken = Buffer.from(JSON.stringify({
      nim: authResult.data.nim,
      timestamp: Date.now()
    })).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: authResult.data
    });

    // Set session cookie
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function DELETE(request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear session cookie
    response.cookies.delete('session');

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
