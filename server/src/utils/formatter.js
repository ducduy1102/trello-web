import { pick } from "lodash";

/**
 * Simple method to Convert a String to Slug
 * Tham khảo thêm kiến thức liên quan ở đây: https://byby.dev/js-slugify-string
 */
export const slugify = (val) => {
  if (!val) return "";
  return String(val)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
};

/**
 * Example:
 */
// const originalStringTest = "Evil Shadow Một Lập Trình Viên";
// const slug = slugify(originalStringTest);

// console.log("originalStringTest:", originalStringTest);
// console.log("slug:", slug);
/**
 * Results:
 *
 * Original String Test: 'Evil Shadow Một Lập Trình Viên'
 * Slug Result: evil-shadow-mot-lap-trinh-vien
 */

// Lấy một số dữ liệu cụ thể trong Người dùng để tránh trả về dữ liệu nhạy cảm như băm mật khẩu
// https://lodash.com/docs/#pick
export const pickUser = (user) => {
  if (!user) return {};

  return pick(user, [
    "_id",
    "email",
    "username",
    "displayName",
    "avatar",
    "role",
    "isActive",
    "createdAt",
    "updatedAt",
  ]);
};
