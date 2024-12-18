"use client"
// utils/nprogress.ts
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

export const startLoading = () => {
    const overlay = document.getElementById("nprogress-overlay");
    if (overlay) {
        overlay.style.display = "block";
    }
    NProgress.start()

}

export const stopLoading = () => {
    const overlay = document.getElementById("nprogress-overlay");
    if (overlay) {
        overlay.style.display = "none";
    }
    NProgress.done()

}