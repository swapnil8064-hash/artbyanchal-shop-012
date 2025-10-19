"use client";

export default function Images({
  data,
  setFeatureImage,
  featureImage,
  imageList,
  setImageList,
}) {
  return (
    <section className="flex flex-col gap-4 bg-white border p-5 rounded-xl shadow-sm">
      <h1 className="font-semibold text-lg text-gray-800">Images</h1>

      {/* Feature Image */}
      <div className="flex flex-col gap-2">
        {(data?.featureImageURL && !featureImage) && (
          <div className="flex justify-center">
            <img
              className="h-24 w-24 object-cover rounded-lg shadow-sm border"
              src={data?.featureImageURL}
              alt="Feature"
            />
          </div>
        )}
        {featureImage && (
          <div className="flex justify-center">
            <img
              className="h-24 w-24 object-cover rounded-lg shadow-sm border"
              src={URL.createObjectURL(featureImage)}
              alt="Feature"
            />
          </div>
        )}

        <label className="text-gray-500 text-xs font-medium" htmlFor="product-feature-image">
          Feature Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="product-feature-image"
          name="product-feature-image"
          onChange={(e) => e.target.files.length > 0 && setFeatureImage(e.target.files[0])}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition cursor-pointer"
        />
      </div>

      {/* Additional Images */}
      <div className="flex flex-col gap-2">
        {(imageList?.length === 0 && data?.imageList?.length > 0) && (
          <div className="flex flex-wrap gap-3">
            {data?.imageList?.map((item, idx) => (
              <img
                key={idx}
                className="w-24 h-24 object-cover rounded-lg shadow-sm border hover:scale-105 transition-transform"
                src={item}
                alt={`Image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {imageList?.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {imageList?.map((item, idx) => (
              <img
                key={idx}
                className="w-24 h-24 object-cover rounded-lg shadow-sm border hover:scale-105 transition-transform"
                src={URL.createObjectURL(item)}
                alt={`Image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <label className="text-gray-500 text-xs font-medium" htmlFor="product-images">
          Images <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="product-images"
          name="product-images"
          multiple
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            setImageList(newFiles);
          }}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition cursor-pointer"
        />
      </div>
    </section>
  );
}
