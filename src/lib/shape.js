// shape.js
export class Shape {
  constructor(x, y, size, imageKey) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.imageKey = imageKey;
    this.angle = 2 * Math.PI * Math.random();
    this.rotate = Math.random() * Math.PI;
    this.speed = 0.2 + Math.random() * 0.5;
  }

  // Update position
  move() {
    this.x += this.speed;
    this.rotate -= this.speed * 0.006;
  }

  // Abstract draw method
  draw(ctx) {
    throw new Error("draw method should be implemented by subclasses");
  }
}

export class Fruit extends Shape {
  constructor(x, y, size, imageKey, images) {
    super(x, y, size, imageKey);
    this.images = images; // Store reference to images
    this.image = images[imageKey];

    this.shaking = false;
    this.showMark = false;
    this.markDuration = 0;
    this.markStartTime = 0;
    this.originalPosition = { x: this.x, y: this.y };
  }

  // Trigger a shaking effect
  shake() {
    this.shaking = true;
    // Update originalPosition to current position
    this.originalPosition = { x: this.x, y: this.y };
    const shakeInterval = setInterval(() => {
      const offset = Math.random() > 0.5 ? 2 : -2;
      this.x += offset;
      this.y += offset;

      setTimeout(() => {
        this.x = this.originalPosition.x;
        this.y = this.originalPosition.y;
      }, 50);
    }, 50);

    setTimeout(() => {
      clearInterval(shakeInterval);
      this.shaking = false;
    }, 300);
  }

  // Display an exclamation mark above the fruit
  displayMark() {
    this.showMark = true;
    this.markStartTime = Date.now();
    this.markDuration = 3000; // Duration in milliseconds
  }

  // Draw the fruit and its exclamation mark
  draw(ctx) {
    // Ensure the fruit image is loaded
    if (!this.image.complete) {
      this.image.onload = () => {
        this.draw(ctx);
      };
      return;
    }

    const halfSize = this.size / 2;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotate);
    ctx.drawImage(this.image, -halfSize, -halfSize, this.size, this.size);
    ctx.restore();

    // Draw exclamation mark if active
    if (this.showMark) {
      const markImage = this.images["mark"];
      // Ensure the mark image is loaded
      if (!markImage.complete) {
        markImage.onload = () => {
          this.draw(ctx);
        };
        return;
      }

      const elapsedTime = Date.now() - this.markStartTime;
      if (elapsedTime > this.markDuration) {
        this.showMark = false;
      } else {
        // Adjust mark size and position
        const markSize = this.size * 0.6; // Adjusted size factor
        ctx.drawImage(
          markImage,
          this.x - markSize / 2,
          this.y - this.size - markSize, // Position above the fruit
          markSize,
          markSize
        );
      }
    }
  }
}
