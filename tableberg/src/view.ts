import { initializeSorting } from "./frontend/sorting";
import { initializeSearch } from "./frontend/search";
import { initializePagination } from "./frontend/pagination";
import { initializeResponsive } from "./frontend/responsive";
import { isProAvailable } from "./pro-status";

function initializeFrontendTableFeatures() {
    initializeResponsive();

    if (!isProAvailable()) {
        return;
    }

    initializeSorting();
    initializeSearch();
    initializePagination();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeFrontendTableFeatures
    );
} else {
    initializeFrontendTableFeatures();
}
