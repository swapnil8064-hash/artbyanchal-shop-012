"use client";

import { useEffect, useState } from "react";
import BasicDetails from "./components/BasicDetails";
import Images from "./components/Images";
import Description from "./components/Description";
import toast from "react-hot-toast";
import { createNewProduct, updateProduct } from "@/lib/firestore/products/write";
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/firestore/products/read_server";

export default function Page() {
  const [data, setData] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    getProduct({ id }).then((res) => {
      if (!res) return toast.error("Product Not Found");
      setData(res);
    }).catch((err) => toast.error(err.message));
  }, [id]);

  const handleData = (key, value) => setData((prev) => ({ ...(prev ?? {}), [key]: value }));

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (id) {
        await updateProduct({ data, featureImage, imageList });
        toast.success("Product successfully Updated!");
        router.push(`/admin/products`);
      } else {
        await createNewProduct({ data, featureImage, imageList });
        setData(null); setFeatureImage(null); setImageList([]);
        toast.success("Product successfully Created!");
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      className="flex flex-col gap-4 p-5"
    >
      <div className="flex justify-between items-center w-full">
        <h1 className="font-semibold text-xl">{id ? "Update Product" : "Create New Product"}</h1>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-deepPink-500 text-white rounded-lg hover:bg-salmonPink-500 transition disabled:opacity-50"
        >
          {isLoading ? "Loading..." : id ? "Update" : "Create"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1"><BasicDetails data={data} handleData={handleData} /></div>
        <div className="flex-1 flex flex-col gap-5">
          <Images data={data} featureImage={featureImage} setFeatureImage={setFeatureImage} imageList={imageList} setImageList={setImageList} />
          <Description data={data} handleData={handleData} />
        </div>
      </div>
    </form>
  );
}
