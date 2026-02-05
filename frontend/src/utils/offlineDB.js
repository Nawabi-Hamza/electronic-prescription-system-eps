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