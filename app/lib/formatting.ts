import { Dayjs } from 'dayjs';

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
export const spanishFormat = (value: Dayjs | null): string => {
    if (!value) return '';
    return value.format('ddd D [de] MMM');
};
export const formatPhoneNumber = (value: string):string => {
    value = value.replace(/\D/g, '');
    if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3')
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d+)/, '$1 $2')
    }
    return value;
}
