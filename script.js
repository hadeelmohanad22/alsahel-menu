
const downloadButton = document.getElementById("downloadPDF");
const downloadStatus = document.getElementById("downloadStatus");

downloadButton.addEventListener("click", async function () {

    if (typeof html2pdf === "undefined") {
        downloadStatus.textContent =
            "تعذّر تحميل مكتبة PDF. تأكدي من اتصال الإنترنت ثم أعيدي المحاولة.";
        return;
    }

    downloadButton.disabled = true;
    downloadStatus.textContent = "جاري تجهيز المنيو PDF...";

    let pdfContainer = null;

    try {
        // إنشاء نسخة خاصة بالتصدير دون تغيير شكل الموقع
        pdfContainer = document.createElement("div");
        pdfContainer.className = "pdf-export";

        const hero = document.querySelector(".hero").cloneNode(true);
        const menu = document.getElementById("menu-document").cloneNode(true);

        pdfContainer.appendChild(hero);
        pdfContainer.appendChild(menu);

        
    // وضع نسخة التصدير في الصفحة دون إخفائها خارج الشاشة
    pdfContainer.style.position = "fixed";
pdfContainer.style.left = "0";
pdfContainer.style.top = "0";
pdfContainer.style.zIndex = "9999";
pdfContainer.style.pointerEvents = "none";
pdfContainer.style.width = "760px";
pdfContainer.style.backgroundColor = "#FFF9EF";


        document.body.appendChild(pdfContainer);

        // التأكد من تحميل جميع الصور قبل إنشاء الملف
        const images = Array.from(pdfContainer.querySelectorAll("img"));

        await Promise.all(images.map(async function (img) {
            if (!img.complete) {
                await new Promise(function (resolve) {
                    img.addEventListener("load", resolve, { once: true });
                    img.addEventListener("error", resolve, { once: true });
                });
            }

            if (img.naturalWidth === 0) {
                throw new Error("تعذّر تحميل إحدى الصور.");
            }

            if (img.decode) {
                await img.decode();
            }
        }));

        // إنشاء ملف PDF قابل للتنزيل
        await html2pdf()
            .set({
                margin: [8, 8, 8, 8],

                filename: "منيو-حلويات-السهل-الأخضر.pdf",

                image: {
                    type: "jpeg",
                    quality: 0.95
                },

                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#FFF9EF",
                    logging: false
                },

                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait"
                },

                pagebreak: {
                    mode: ["css", "legacy"],
                    avoid: [".dessert-card"]
                }
            })
            .from(pdfContainer)
            .save();

        downloadStatus.textContent =
            "تم تجهيز المنيو! تحققي من التنزيلات على جهازك.";

    } catch (error) {
        console.error(error);

        downloadStatus.textContent =
            "ما قدرنا ننشئ الملف. تأكدي من وجود الصور واتصال الإنترنت، ثم حاولي مرة ثانية.";

    } finally {
        if (pdfContainer) {
            pdfContainer.remove();
        }

        downloadButton.disabled = false;
    }
});
