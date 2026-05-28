export const required = (value) => String(value ?? "").trim().length > 0;

export const validateRide = ({ origin, destination, date, seats, price }) => {
  if (!required(origin) || !required(destination) || !required(date)) return "Origin, destination, and date are required";
  if (Number(seats) < 1) return "Seats must be at least 1";
  if (Number(price) < 0) return "Price cannot be negative";
  return "";
};

export const validateAuth = ({ name, email, password }, isRegister) => {
  if (isRegister && !required(name)) return "Name is required";
  if (!required(email)) return "Email is required";
  if (!required(password)) return "Password is required";
  return "";
};
