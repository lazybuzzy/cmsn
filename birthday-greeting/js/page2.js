/* ==============================================
   FIREWORKS ANIMATION - PHÁO BÔNG
   Hiệu ứng pháo hoa tự động nổ liên tục và đẹp hơn
   ============================================== */

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas khi thay đổi kích thước window
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Particle class cho pháo bông với hiệu ứng đẹp hơn
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 10, // 📌 Tăng tốc độ bay
            y: (Math.random() - 0.5) * 10
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.01 + 0.01; // 📌 Chậm mờ hơn
        this.size = Math.random() * 4 + 2; // 📌 Kích thước ngẫu nhiên
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        // Vẽ hạt với hiệu ứng glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    update() {
        this.velocity.x *= 0.96; // 📌 Giảm ma sát
        this.velocity.y *= 0.96;
        this.velocity.y += 0.15; // 📌 Trọng lực nhẹ hơn
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        this.size *= 0.98; // Giảm dần kích thước
    }
}

// Rocket class - tên lửa bay lên trước khi nổ
class Rocket {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.4 + 100;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: -Math.random() * 3 - 8 // Bay lên nhanh
        };
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        // Vẽ tên lửa
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Vẽ đuôi tên lửa
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.velocity.x * 5, this.y - this.velocity.y * 5);
        ctx.stroke();

        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.1; // Trọng lực
    }

    shouldExplode() {
        return this.y <= this.targetY || this.velocity.y >= 0;
    }
}

// Mảng chứa các particle và rockets
let particles = [];
let rockets = [];

// Màu sắc cho pháo bông - thêm nhiều màu đẹp hơn
const colors = [
    '#ff0080', // Hồng neon
    '#ff6b9d', // Hồng pastel
    '#c06c84', // Hồng tím
    '#f67280', // Đỏ coral
    '#ffd93d', // Vàng
    '#6bcf7f', // Xanh lá
    '#4d9de0', // Xanh dương
    '#e15554', // Đỏ
    '#7768ae', // Tím
    '#00ffff', // Cyan
    '#ff00ff', // Magenta
    '#ffff00', // Vàng neon
];

// Tạo pháo bông tại vị trí x, y với nhiều kiểu nổ
function createFirework(x, y, type = 'normal') {
    let particleCount;
    let color;

    switch (type) {
        case 'big': // Pháo lớn
            particleCount = 100;
            color = colors[Math.floor(Math.random() * colors.length)];
            break;
        case 'ring': // Pháo nổ thành vòng
            particleCount = 80;
            color = colors[Math.floor(Math.random() * colors.length)];
            createRingFirework(x, y, color);
            return;
        case 'multicolor': // Pháo nhiều màu
            particleCount = 70;
            createMultiColorFirework(x, y);
            return;
        default: // Pháo bình thường
            particleCount = 60;
            color = colors[Math.floor(Math.random() * colors.length)];
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Pháo nổ thành vòng
function createRingFirework(x, y, color) {
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const particle = new Particle(x, y, color);
        const speed = 8;
        particle.velocity.x = Math.cos(angle) * speed;
        particle.velocity.y = Math.sin(angle) * speed;
        particles.push(particle);
    }
}

// Pháo nhiều màu
function createMultiColorFirework(x, y) {
    const particleCount = 70;
    for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Làm mờ canvas để tạo hiệu ứng trail đẹp hơn
    ctx.fillStyle = 'rgba(10, 10, 26, 0.15)'; // 📌 Nền tối hơn, trail dài hơn
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update và vẽ rockets
    rockets.forEach((rocket, index) => {
        rocket.update();
        rocket.draw();

        if (rocket.shouldExplode() && !rocket.exploded) {
            rocket.exploded = true;
            // Chọn ngẫu nhiên kiểu nổ
            const types = ['normal', 'big', 'ring', 'multicolor'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            createFirework(rocket.x, rocket.y, randomType);
            rockets.splice(index, 1);
        }
    });

    // Update và vẽ particles
    particles.forEach((particle, index) => {
        if (particle.alpha > 0) {
            particle.update();
            particle.draw();
        } else {
            particles.splice(index, 1);
        }
    });
}

// Tự động tạo tên lửa
function launchRocket() {
    rockets.push(new Rocket());
}

// 📌 PHÁO NỔ LIÊN TỤC - TẦN SUẤT CAO
setInterval(launchRocket, 400); // 📌 Nổ mỗi 0.4 giây (liên tục hơn)

// Thêm burst - nổ nhiều quả cùng lúc
function createBurst() {
    const burstCount = Math.floor(Math.random() * 3) + 2; // 2-4 quả cùng lúc
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => launchRocket(), i * 100);
    }
}

// 📌 NỔ NHIỀU QUẢ CÙNG LÚC
setInterval(createBurst, 2000); // 📌 Mỗi 2 giây nổ 1 burst

// Click để tạo pháo bông
canvas.addEventListener('click', (e) => {
    createFirework(e.clientX, e.clientY, 'big');
});

// Bắt đầu animation
animate();

// Tạo pháo bông ngay khi load trang - chào mừng đặc biệt
window.addEventListener('load', () => {
    // Nổ 5 quả pháo chào mừng
    setTimeout(() => createFirework(canvas.width * 0.2, canvas.height * 0.3, 'big'), 300);
    setTimeout(() => createFirework(canvas.width * 0.4, canvas.height * 0.25, 'multicolor'), 600);
    setTimeout(() => createFirework(canvas.width * 0.5, canvas.height * 0.35, 'ring'), 900);
    setTimeout(() => createFirework(canvas.width * 0.6, canvas.height * 0.28, 'big'), 1200);
    setTimeout(() => createFirework(canvas.width * 0.8, canvas.height * 0.32, 'multicolor'), 1500);

    // Bắt đầu liên tục sau 2 giây
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => launchRocket(), i * 200);
        }
    }, 2000);
});

/* ==============================================
   GHI CHÚ NHANH:
   
   📌 CHỈNH TẦN SUẤT NỔ:
   - Nổ liên tục: Dòng 207 (400ms - càng nhỏ càng nhanh)
   - Burst (nổ nhiều quả): Dòng 217 (2000ms)
   - Số quả/burst: Dòng 211 (2-4 quả)
   
   📌 CHỈNH HIỆU ỨNG:
   - Số hạt pháo thường: Dòng 166 (60 hạt)
   - Số hạt pháo lớn: Dòng 154 (100 hạt)
   - Số hạt pháo vòng: Dòng 158 (80 hạt)
   - Kích thước hạt: Dòng 31 (2-6px)
   - Độ sáng glow: Dòng 38 (15px)
   
   📌 KIỂU NỔ:
   - normal: Pháo bình thường
   - big: Pháo lớn (100 hạt)
   - ring: Pháo nổ thành vòng tròn
   - multicolor: Pháo nhiều màu
   
   💡 GỢI Ý TỐC ĐỘ:
   - Liên tục cực nhanh: 200-300ms
   - Liên tục nhanh: 400-500ms (ĐANG DÙNG)
   - Vừa phải: 600-800ms
   - Chậm: 1000ms+
   
   🎆 TÍNH NĂNG MỚI:
   - Tên lửa bay lên trước khi nổ (có đuôi)
   - 4 kiểu nổ khác nhau
   - Burst mode (nổ nhiều quả cùng lúc)
   - Hiệu ứng glow và shadow
   - Màu sắc đa dạng hơn (12 màu)
   - Trail dài và đẹp hơn
   - Click để nổ pháo lớn
   
   🎨 ĐỔI MÀU PHÁO:
   - Thêm màu mới vào array colors (dòng 124-137)
   - Format: '#RRGGBB' hoặc tên màu
   ============================================== */