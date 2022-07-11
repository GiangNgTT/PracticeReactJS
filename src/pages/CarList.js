
import { useState, useEffect  } from "react";
import { Link } from 'react-router-dom';
import { Button } from "reactstrap";
import axios from "axios";
import AddCar from './AddCar';
import EditCar from './EditCar';


const CarList=()=>{
   
    const [cars,setCars]=useState([{
        id:"",
        model:"",
        description:"",
        produced_on:"",
        image:""
    }]);  //cars là 1 mảng các đối tượng
    const [noDataFound,setNoDataFound]=useState("");
    
    //gọi hàm này khi CarList được render lần đầu (chú ý tham số thứ 2 là mảng rỗng). Hàm này như hàm lifecycle componentDidMount()
    useEffect(() => {
        getCars();
        //console.log("hello carlist");
      },[]);

    //cập nhật lại state cars
    const getCars=()=>{
        axios.get('http://localhost:8000/api/cars').then((res)=>{
            console.log(res.data);
            if(res.status===200){
                setCars(res.data.data?res.data.data:[]); //c là biến tự đặt tên gì cũng đc, ko có nó thì in ra cars=[]
                console.log(res.data.data?res.data.data:[]);
                console.log(cars);//vì cars lúc này chỉ render 
            };
            if(res.data.status==="failed" && res.data.success===false){
                setNoDataFound(res.data.message);
                console.log(noDataFound);
            };
        }).catch((error)=>{
            console.log(error);
        });
    };

    //bắt đầu làm cho EditCar.js
    const [editmodal, setEditModal] = useState(false);
    
    const [editCarData,setEditCarData]=useState({
        id:"",
        model:"",
        description:"",
        produced_on:"",
        manufacturer:"",
        image:""
    });  //editCarData là 1 mảng các đối tượng lưu dữ liệu đối tượng Car được edit
    //hàm này nhận biến car ở sự kiện onClick() của nút Sửa
    const toggleEditModal = (car) => {
        setEditModal(!editmodal);
        if (editmodal===false) setEditCarData(car);  //phải có kiểm tra điều kiện form edit được mở thì mới cập nhật không thì sẽ lỗi không nhận ra editCarData.manufacturer.id khi đóng form
        console.log(editCarData);
    }
    //tham số car này là tham số đầu vào
    const deleteCar=(id)=> {
        axios.delete('http://localhost:8000/api/cars/' + id)  //tham số truyền vào là id
        .then((res) => {
        console.log("Car removed deleted");
        getCars();
        }).catch((error) => {
        console.log(error)
        })
    }//đóng delete
    return (   
    <div className='container'>
        <h4 className="font-weight-bold">List of Cars</h4>  
        <AddCar getCars={ getCars } /> 
        <Link to="/cars/add"><Button color="primary">Add car page</Button></Link>

        <EditCar cars={cars} setCars={setCars} getCars={ getCars} toggleEditModal={ toggleEditModal } editmodal={ editmodal } editCarData={editCarData} setEditCarData={setEditCarData}/>  
        <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Model</th>
            <th>Description</th>
            <th>Produced_on</th>
            <th>Image</th>
            <th colSpan={2}>Function</th>
          </tr>
        </thead>
        <tbody>
            {cars.length===0?<tr><td><h2>No data found</h2></td></tr>:
                cars.map((car,index)=>(
                    <tr key={index}>
                        <td>{car.id}</td>
                        <td>{car.model}</td>
                        <td style={{width: "35em"}}>{car.description}</td>
                        <td>{car.produced_on}</td>
                        <td><img className="img-thumnail" style={{width: "10em"}} src={car.image?"http://localhost:8000/images/"+car.image:''}/></td>
                        <td colSpan={2}>
                        <button type="button" className="btn btn-success" onClick={()=>toggleEditModal(car)}>Edit</button>
                        <button type="button" className="btn btn-danger" onClick={()=>{ if(window.confirm('Bạn có chắc chắn xóa?')) deleteCar(car.id)} }>Delete</button>
                        </td>
                    </tr>
                    )
                )
            }           
        </tbody>
        </table>
    </div>
    );
};
export default CarList;