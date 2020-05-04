/** @format */

import memoize from "fast-memoize";

export const utilityFormatImageForUpload = memoize((image: string) => {
  const boundary = "myboundary";
  const data = `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="file.png"\r\nContent-Type: image/png\r\n\r\n${image}\r\n--${boundary}--`;
  return data;
});
