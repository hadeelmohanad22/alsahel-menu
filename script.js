
const shareButton = document.getElementById("shareMenu");
const shareStatus = document.getElementById("shareStatus");

shareButton.addEventListener("click", async function () {
    const menuLink = window.location.href;

    const shareData = {
        title: "حلويات السهل الأخضر",
        text: "تفضلوا شوفوا منيو حلويات السهل الأخضر 🤎",
        url: menuLink
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(menuLink);
            shareStatus.textContent =
                "تم نسخ رابط المنيو! ابعتيه لأصحابك 🤎";
        } else {
            window.prompt("انسخي رابط المنيو وشاركيه:", menuLink);
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            shareStatus.textContent =
                "ما زبطت المشاركة. جربي نسخ رابط الموقع من شريط العنوان.";
        }
    }
});
