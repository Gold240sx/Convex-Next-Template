import React from "react";

const idGenerator = (): string => {
  const id = Math.floor(Math.random() * 10001).toString();

  return id;
};

export default idGenerator;
