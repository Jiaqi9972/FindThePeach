"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Fruit } from "@/lib/shape";

// List of fruit names corresponding to image keys
const fruitNames = [
  "Ancient_Fruit",
  "Apricot",
  "Banana",
  "Cherry",
  "Melon",
  "Pomegranate",
  "Apple",
  "Coconut",
  "Orange",
  "Strawberry",
  "Starfruit",
  "Blueberry",
  "Grape",
  "Peach",
  "Cranberries",
  "Mango",
  "Pineapple",
  "Stardrop",
  "Sweet_Gem_Berry",
];

export default function ShapeEffect({ count, sizes }) {
  const canvas = useRef(null);
  const shapes = useRef([]);
  const images = useRef({}); // Use useRef to store images

  // Load images in useEffect to ensure it runs only on the client
  useEffect(() => {
    const imagePaths = [
      "Ancient_Fruit.png",
      "Apricot.png",
      "Banana.png",
      "Cherry.png",
      "Cranberries.png",
      "Mango.png",
      "Pineapple.png",
      "Melon.png",
      "Pomegranate.png",
      "Apple.png",
      "Coconut.png",
      "Orange.png",
      "Strawberry.png",
      "Starfruit.png",
      "Blueberry.png",
      "Grape.png",
      "Peach.png",
      "Stardrop.png",
      "Sweet_Gem_Berry.png",
    ];

    const loadedImages = {};
    imagePaths.forEach((fileName) => {
      const key = fileName.split(".")[0];
      const img = new window.Image();
      img.src = `/fruits/${fileName}`;
      loadedImages[key] = img;
    });

    // Load mark image
    const markImage = new window.Image();
    markImage.src = "/mark.png";
    loadedImages["mark"] = markImage;

    images.current = loadedImages;
  }, []);

  // Adjust the canvas size to fit its container
  const resize = useCallback(() => {
    if (!canvas.current) return;

    const rect = canvas.current.getBoundingClientRect();
    canvas.current.width = rect.width;
    canvas.current.height = rect.height;
  }, []);

  // Fill the canvas with random fruit shapes
  const fill = useCallback(() => {
    if (!canvas.current) return;
    const ctxWidth = canvas.current.width;
    const ctxHeight = canvas.current.height;
    const firstTime = shapes.current.length === 0;

    while (shapes.current.length < count) {
      const fruitName =
        fruitNames[Math.floor(Math.random() * fruitNames.length)];
      const size = sizes[0] + Math.random() * (sizes[1] - sizes[0]);
      const x = firstTime ? Math.random() * ctxWidth : -size;
      const y = Math.random() * ctxHeight;

      shapes.current.push(new Fruit(x, y, size, fruitName, images.current));
    }
  }, [count, sizes]);

  // Draw all shapes on the canvas
  const draw = useCallback(() => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    const ctxWidth = canvas.current.width;
    const ctxHeight = canvas.current.height;

    ctx.clearRect(0, 0, ctxWidth, ctxHeight);

    shapes.current.forEach((shape) => {
      shape.move(); // Update position
      shape.draw(ctx); // Draw shape on canvas
    });

    // Remove shapes that move off the canvas
    shapes.current = shapes.current.filter((shape) => {
      return shape.x - shape.size < ctxWidth;
    });
  }, []);

  // Animation loop
  const tick = useCallback(() => {
    fill();
    draw();
    requestAnimationFrame(tick);
  }, [fill, draw]);

  // Handle clicks to trigger events on specific shapes
  const handleWindowClick = useCallback((event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    shapes.current.forEach((shape) => {
      if (
        mouseX >= shape.x - shape.size / 2 &&
        mouseX <= shape.x + shape.size / 2 &&
        mouseY >= shape.y - shape.size / 2 &&
        mouseY <= shape.y + shape.size / 2
      ) {
        if (shape.imageKey === "Peach") {
          shape.shake();
          shape.displayMark();
        }
      }
    });
  }, []);

  // Initialize the animation and event listeners
  useEffect(() => {
    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleWindowClick);
    };
  }, [resize, tick, handleWindowClick]);

  return (
    <canvas
      ref={canvas}
      className="w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
