"use client";

import { useUsers } from "@/lib/firestore/user/read";

export default function ListView() {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-5">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-3 md:px-0 px-2 rounded-xl overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead className="bg-white sticky top-0 shadow-md z-10">
          <tr>
            <th className="font-semibold border-b px-4 py-2 text-center text-gray-700 rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-b px-4 py-2 text-center text-gray-700">
              Photo
            </th>
            <th className="font-semibold border-b px-4 py-2 text-left text-gray-700">
              Name
            </th>
            <th className="font-semibold border-b px-4 py-2 text-left text-gray-700 rounded-r-lg">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((item, index) => (
            <Row key={`user-${item?.id || index}`} index={index} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index }) {
  return (
    <tr className="hover:bg-pink-50 transition-colors duration-200 rounded-lg shadow-sm">
      <td className="px-4 py-3 text-center text-gray-700 font-medium">{index + 1}</td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {item?.photoURL ? (
              <img
                src={item.photoURL}
                alt={item.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-400 font-semibold">
                {item?.displayName?.[0] ?? "U"}
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 font-medium">{item?.displayName}</td>
      <td className="px-4 py-3 text-gray-700">{item?.email}</td>
    </tr>
  );
}
