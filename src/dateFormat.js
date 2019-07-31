export const dateFormat=(date)=>{
    const productDate = new Date(date)
    const currentDate = new Date()
    const diffDays = currentDate.getDate() - productDate.getDate()
    if (diffDays <= 7)
    {
         return diffDays + " " + "days ago"
    }
    else{
        return productDate.getDate() + "/" + productDate.getMonth() + "/" + productDate.getFullYear() 
    }
}