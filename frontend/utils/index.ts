export const beautifyAddress = (address: string) => {
  return `${address.substring(0, 5)}...${address.substring(address.length - 6, address.length - 1)}`
}