"use client";

import { useUsers } from "@/lib/firestore/user/read";

export default function ListView() {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-center">
              Photo
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Name
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((item, index) => (
            <Row key={item?.id} index={index} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index }) {
  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex justify-center">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
            {item?.photoURL ? (
              <img
                src={item.photoURL}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500 flex items-center justify-center h-full w-full">
                {item?.displayName?.[0] ?? "U"}
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">{item?.displayName}</td>
      <td className="border-y bg-white px-3 py-2">{item?.email}</td>
    </tr>
  );
}
