import styles from './styles.module.css'
export default function ActionLog() {
  const logData = Array.from(
    { length: 50 },
    (_, index) =>
      `May-1,2023 - Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum  horrn has${index + 1}`
  );

  return (
    <div className="ml-3">
      <h2 className=" font-semibold text-[#26435F] mb-2">ActionLog</h2>
      <div className="flex border border-solid border-gray-200 bg-[#FFFFFF]">
        <ul className="list-disc overflow-y-scroll max-h-[20.6rem]">
          <div className='mr-5'>
            <p className='uppercase  pl-[29px] pt-[16px] pb-3 text-[#26435F]'>May. 1, 2023</p>
          </div>
          <div className='h-[1px] bg-[#CBD6E2]' />
          {logData.map((item, index) => (
            // <li key={index} className="flex">
            //   <span className="mr-4 text-gray-500">{item.slice(0, 12)}</span>
            //   <span>{item.slice(12)}</span>
            // </li>
            <div key={index} className='flex ml-2 h-[57px] pl-5'>
              <p className='text-[#4A556C] pt-5 font-medium text-xs mr-6 w-[65px]'>2:10 pm</p>
              <div className={`pt-5 ${styles.actionBorder}`}>
                <div className={styles.circle}>
                  <div className={styles.circle2}></div>
                </div>
                <p className='pl-5 text-sm font-medium text-[#4A556C]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
