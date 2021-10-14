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

const validateColor = (color, default_value = 'inherit') => {
    let result = colors.includes(color) ? color : default_value;
    result = result.replace('.', '-')

    return result;
}

export default validateColor;
