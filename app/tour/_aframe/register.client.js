// app/tour/_aframe/register.client.js
"use client";
import "aframe";

if (!AFRAME.components["spin"]) {
  AFRAME.registerComponent("spin", {
    schema: { speed: { type: "number", default: 0.5 } },
    tick(time, dt) {
      const r = this.el.getAttribute("rotation");
      this.el.setAttribute("rotation", {
        x: r.x,
        y: r.y + (this.data.speed * dt) / 16.666,
        z: r.z,
      });
    },
  });
}
