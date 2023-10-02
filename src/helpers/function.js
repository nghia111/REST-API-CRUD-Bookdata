const generateCode = (value) => {
    let output = ''
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').forEach(item => {
        output += item.charAt(2) + item.charAt(0) + item.charAt(1)
    });
    return (output + value.length).toUpperCase()
}
export default generateCode