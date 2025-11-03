const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    })
export const handlePriceFormat = (value: string) => {
    const raw = value.replace(/[^0-9]/g, '')
    if (raw === '') {
        return
    }
    const formatPrice = formatter.format(parseInt(raw, 10))
    return formatPrice;
}