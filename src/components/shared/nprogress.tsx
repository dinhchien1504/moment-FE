"use client"
// utils/nprogress.ts
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

export const startLoading = () => NProgress.start()
export const stopLoading = () => NProgress.done()