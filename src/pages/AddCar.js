import { useState } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Input,
  } from "reactstrap";
  
const AddCar=({getCars})=>{
    const [modal, setModal] = useState(false);
    const [car,setCar]=useState({
        file:null,
        model:"",
        description:"",
        produced_on:"",
        image:""
    });

    const toggle = () => setModal(!modal);

    const onChangeModel=(event)=>{
        setCar(previousState=>{
            return {...previousState,model: event.target.value};
        });
        console.log(car);
    };

    const onChangeDesc=(event)=>{
        setCar(previousState=>{
            return {...previousState,description: event.target.value};
        });
        console.log(car);
    };

    const onChangeProduced=(event)=>{
        setCar(previousState=>{
            return {...previousState,produced_on: event.target.value};
        });
        console.log(car);
    };

    const onChangeImage=(event)=>{
        setCar(previousState=>{
            return {...previousState,file: URL.createObjectURL(event.target.files[0]),image:event.target.files[0].name};
        });
        console.log(car);
    };

    const onSubmitForm=(event)=>{
        event.preventDefault();
        const fileInput=document.querySelector('#fileupload');
        const formData=new FormData();
        formData.append('image',fileInput.files[0]);
        formData.append('description',car.description);
        formData.append('model',car.model);
        formData.append('produced_on',car.produced_on);

        fetch('http://localhost:8000/api/cars',{method:'post',body:formData})
        .then(res=>{return res.json()})
        .then(data=>{
            console.log(data);
            toggle();  //đóng form modal
            onRedirect();
        })
    };
   
    const onRedirect=()=>{
        setCar([]);  //set lại state car là mảng rỗng
        toggle();
        getCars();
    };
    return(
        <div>
            <Button className="float-right mb-4" color="primary" onClick={toggle} >
              Add car
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
            <form onSubmit={onSubmitForm} encType="multipart/form-data" method="post">
             <ModalHeader toggle={toggle}>Add new car</ModalHeader>
             <ModalBody>
                <FormGroup>
                  <Label for="model">Model</Label>
                  <Input id="model" name="model" onChange={onChangeModel}/>
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input id="description" name="description" onChange={onChangeDesc}/>
                </FormGroup>
                <FormGroup>
                  <Label for="produced_on">Produced_on</Label>
                  <Input type="date" id="produced_on" name="produced_on" onChange={onChangeProduced}/>
                </FormGroup>
                 <FormGroup>
                  <Label for="image">Image</Label>
                  <Input id="fileupload" type="file" name="image" onChange={onChangeImage}/>
                    <img className="img-thumbnail img-fluid" src={car.file} alt=''/>
                </FormGroup>

              </ModalBody>
              <ModalFooter>
                  <Button type="submit" color="primary"> Add </Button>
                  <Button color="secondary" onClick={toggle}> Cancel </Button>
               </ModalFooter>
               </form>
            </Modal>
          </div>
    
          );
};
export default AddCar;