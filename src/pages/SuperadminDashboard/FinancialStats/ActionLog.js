export default function ActionLog() {
  const logData = Array.from(
    { length: 50 },
    (_, index) =>
      `May-1,2023 - Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum  horrn has${index + 1}`
  );

  return (
    <div className="ml-3">
      <h2 className="text-2xl font-bold">ActionLog</h2>
      <div className="flex border border-solid border-gray-200 p-5">
        <ul className="list-disc overflow-y-scroll max-h-72">
          {logData.map((item, index) => (
            <li key={index} className="flex">
              <span className="mr-4 text-gray-500">{item.slice(0, 12)}</span>
              <span>{item.slice(12)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
