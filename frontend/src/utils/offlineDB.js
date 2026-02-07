// src/lib/offlineDB.js
import localforage from "localforage";
import api from "../api/axios";

export const offlineDB = localforage.createInstance({
  name: "eps",
  storeName: "offline_cache",
});


export async function cacheImageByPath(imagePath, apiURL) {
  const res = await fetch(`${apiURL}${imagePath}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Image download failed");

  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error("Not an image: " + blob.type);
  }

  await offlineDB.setItem(`img_${imagePath}`, blob);
  return blob;
}


export async function getCachedImageByPath(imagePath) {
  return offlineDB.getItem(`img_${imagePath}`);
}

export async function getPrescriptionNumber({ seter }){
  const n = await offlineDB.getItem("prescription_number")
  return seter(n ? n+1: 1)
}

export async function getCurrentBillNumber({ seter }){
    const pn = await offlineDB.getItem("prescription_number")
    const num = pn ? pn:0;  
    return seter(num)
}

export async function nextBillNumber({ seter }){
    const pn = await offlineDB.getItem("prescription_number")
    const nextNum = pn ? pn+1:1;  
    await offlineDB.setItem("prescription_number", nextNum)
    return seter(nextNum)
}
