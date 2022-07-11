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
  import axios from "axios";

const EditCar=({getCars, toggleEditModal,editCarData,editmodal,setEditCarData})=>{ 
    const onChangeModel=(e)=>{
        setEditCarData(previousState=>{
            return {...previousState,model: e.target.value};
        });
    };

    const onChangeDesc=(e)=>{
        setEditCarData(previousState=>{
            return {...previousState, description: e.target.value};
        });       
    };

    const onChangeProduced=(e)=>{
        setEditCarData(previousState=>{
            return {...previousState, produced_on: e.target.value};
        });      
    };

    const onChangeImage=(e)=>{
        const preImg=document.getElementById('preview-img');
        const file=e.target.files[0];
        if(file){
            var reader = new FileReader();
            reader.onload = (e)=> {
                const obj_url=URL.createObjectURL(file);
                preImg.setAttribute('src', obj_url);
                URL.revokeObjectURL(obj_url);
            };     
        }
        console.log(preImg.src);
        setEditCarData(previousState=>{
            return {...previousState,image:e.target.files[0].name};
        });     
    };

    const onRedirect=()=>{
        toggleEditModal(editCarData); 
        getCars();  
    };

    const handleSubmitForm= async(e)=>{
        e.preventDefault(); 
        const fileInput=document.querySelector('#fileinput');

        const formData=new FormData();
        formData.append('model',editCarData.model);
        formData.append('description',editCarData.description);
        formData.append('produced_on',editCarData.produced_on);
        formData.append('image',fileInput.files[0]);
        formData.append("_method", "put");

        await axios
        .post('http://localhost:8000/api/cars/'+ editCarData.id, formData)
        .then(res=>{
            console.log(res);
            onRedirect();
        })
        .catch((res) => console.log(res));
        };   
    
    return(
        <div>
            <Modal isOpen={editmodal} toggle={toggleEditModal}>
            <form onSubmit={handleSubmitForm} encType="multipart/form-data" method="post">
             <ModalHeader toggle={toggleEditModal}>Edit a car</ModalHeader>
             <ModalBody>
                <FormGroup>
                  <Label for="model">Model</Label>
                  <Input id="model" name="model" onChange={onChangeModel} value={editCarData.model?editCarData.model:''}/>
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input id="description" name="description" onChange={onChangeDesc} value={editCarData.description?editCarData.description:''}/>
                </FormGroup>
                <FormGroup>
                  <Label for="produced_on">Produced_on</Label>
                  <Input type="date" id="produced_on" name="produced_on" onChange={onChangeProduced} value={editCarData.description?editCarData.produced_on:''}/>
                </FormGroup>
                 <FormGroup>
                  <Label for="image">Image</Label>
                  <Input id="fileinput" type="file" name="image" onChange={onChangeImage}/>
                    <img id="preview-img" className="img-thumbnail img-fluid" src={editCarData.image?"http://localhost:8000/images/"+editCarData.image:'#'} alt=''/>       
                </FormGroup>

              </ModalBody>
              <ModalFooter>
                  <Button type="submit" color="primary"> Update </Button>
                  <Button color="secondary" onClick={toggleEditModal}> Cancel </Button>
               </ModalFooter>
               </form>
            </Modal>
          </div>
    
          );
};
export default EditCar;