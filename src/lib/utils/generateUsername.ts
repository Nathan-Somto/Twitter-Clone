function generateUsername(name:string){
    const names = name.split(' ')[0];
    const number = Math.floor(Math.random() * 105);
    return names+number;
}
export default generateUsername