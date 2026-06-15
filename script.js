/* script.js - ส่วนควบคุมระบบ ข้อมูลบริการ ระบบแบ่งหน้า และระบบคลิกขยายรูปภาพ */

// --- 1. ส่วนของฐานข้อมูลจำลอง (สามารถมาเพิ่ม/ลบ/แก้ไขบริการตรงนี้ได้เลย) ---
const servicesData = [
    {
        id: 1,
        icon: "⚡",
        title: "บริการตรวจเช็คและเดินสายไฟฟ้า",
        description: "รับเดินสายไฟภายในและภายนอกอาคาร ตรวจเช็คระบบไฟรั่ว ไฟช็อต เพิ่มจุดปลั๊กไฟ และติดตั้งตู้ควบคุมไฟ โดยช่างไฟฟ้ามืออาชีพ",
        images: ["uploads/1.jpg", "uploads/2.jpg"]
    },
    {
        id: 2,
        icon: "❄️",
        title: "บริการล้างและติดตั้งแอร์",
        description: "ล้างแอร์บ้าน แอร์โรงงาน เติมน้ำยาแอร์ ตรวจเช็คอาการแอร์ไม่เย็น แอร์มีแต่ลม หรือน้ำหยด พร้อมรับประกันงานหลังบริการ",
        images: ["uploads/air1.jpg", "uploads/air2.jpg"]
    },
    {
        id: 3,
        icon: "🌐",
        title: "วางระบบเครือข่ายและอินเทอร์เน็ต (Network)",
        description: "รับวางระบบ LAN, Wi-Fi สำหรับบ้าน พักอาศัย ออฟฟิศ และหอพัก เซ็ตอัพอุปกรณ์ Router, Access Point ให้ใช้งานได้ครอบคลุมและเสถียร",
        images: ["uploads/net1.jpg"]
    },
    {
        id: 4,
        icon: "📷",
        title: "ติดตั้งกล้องวงจรปิด (CCTV)",
        description: "บริการออกแบบและติดตั้งกล้องวงจรปิดทุกระบบ ดูกล้องผ่านมือถือได้ทุกที่ทุกเวลา ช่วยรักษาความปลอดภัยให้บ้านและธุรกิจของคุณ",
        images: ["uploads/cctv1.jpg", "uploads/cctv2.jpg"]
    }
];

// --- 2. การตั้งค่าระบบแบ่งหน้า (Pagination) ---
const limit = 6; 
let currentPage = 1;

function renderServices(page) {
    const servicesList = document.getElementById('services-list');
    if (!servicesList) return;
    
    servicesList.innerHTML = '';

    const offset = (page - 1) * limit;
    const paginatedItems = servicesData.slice(offset, offset + limit);

    if (paginatedItems.length === 0) {
        servicesList.innerHTML = "<p style='color: #666;'>ยังไม่มีข้อมูลบริการในขณะนี้</p>";
        return;
    }

    paginatedItems.forEach(service => {
        let serviceBox = document.createElement('div');
        serviceBox.className = 'service-box';

        let galleryHtml = '';
        if (service.images && service.images.length > 0) {
            galleryHtml = '<div class="gallery">';
            service.images.forEach(imgSrc => {
                galleryHtml += `<img src="${imgSrc}" alt="ภาพผลงานบริการ" onerror="this.style.display='none'">`;
            });
            galleryHtml += '</div>';
        }

        serviceBox.innerHTML = `
            ${galleryHtml}
            <h3>${service.icon} ${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description).replace(/\n/g, '<br>')}</p>
        `;
        servicesList.appendChild(serviceBox);
    });

    initLightboxEvents();
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(servicesData.length / limit);
    if (totalPages <= 1) return; 

    for (let i = 1; i <= totalPages; i++) {
        let pageLink = document.createElement('a');
        pageLink.innerText = i;
        if (i === currentPage) {
            pageLink.className = 'active';
        }

        pageLink.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = i;
            renderServices(currentPage);
            renderPagination();
            
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        });

        paginationContainer.appendChild(pageLink);
    }
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// --- 3. ระบบ Lightbox (คลิกดูรูปขยายใหญ่) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function closeLightbox() {
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function initLightboxEvents() {
    document.querySelectorAll('.gallery img').forEach(img => {
        img.addEventListener('click', function() {
            if (lightbox && lightboxImg) {
                lightboxImg.src = this.src;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

if (lightbox) {
    lightbox.addEventListener('click', closeLightbox);
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && lightbox && lightbox.style.display === 'flex') {
        closeLightbox();
    }
});

// --- 4. สั่งเริ่มระบบเมื่อโหลดหน้าเว็บเรียบร้อยแล้ว ---
document.addEventListener('DOMContentLoaded', () => {
    // ดึงปีปัจจุบันใส่ใน Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.innerText = new Date().getFullYear();

    renderServices(currentPage);
    renderPagination();
});
