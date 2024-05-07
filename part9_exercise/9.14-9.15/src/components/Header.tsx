type p = {
    courseName: string;
  };  
const Header=(props:p)=>{
    return(
    <>
    <h1>{props.courseName}</h1>
    </>)
}

export default Header