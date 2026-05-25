export function formatPrice(price: number): string {
  return `GHC ${price.toLocaleString()}/sem`
}
