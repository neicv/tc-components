const colors = [
    'bg-blue',
    'bg-grey',
    'color-white',
    'primary', 'secondary',
    'success', 'warning', 'error', 'info',
    'grey',
    'inherit',
    'text.secondary',
    'text.primary'
]

const validateColor = (color, defaultValue = 'inherit') => {
    let result = colors.includes(color) ? color : defaultValue;
    result = result.replace('.', '-')

    return result;
}

export default validateColor;
