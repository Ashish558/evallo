import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function TableHeader({
  header,
  dataFor,
  onClick,
  setSorted,
  Icon,
  noArrow,
}) {

  return (
    <th className={`${styles.customHeader} ${noArrow?"no-arrow":''} py-3   text-sm`}>
      <div className="flex items-center">
        {header}
        {Icon && Icon}
      </div>
    </th>
  );
}
