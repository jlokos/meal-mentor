import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";

export const checkBarcodeInFirebase = async (barcode) => {
  const barcodeRef = doc(db, "barcodes", barcode);
  const barcodeDoc = await getDoc(barcodeRef);
  return barcodeDoc.exists() ? barcodeDoc.data().response : null;
}

export const saveBarcodeToFirebase = async (barcode, response) => {
  const barcodeRef = doc(db, "barcodes", barcode);
  await setDoc(barcodeRef, {
    barcode: barcode,
    response: response
  });
}
