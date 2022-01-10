<template>
  <div class="perssion_user">
        <el-button type="primary" @click="handleAddRole">New Role</el-button>

        <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
        <el-table-column prop="key" label="Role Key" align="center" width="220">
        </el-table-column>
        <el-table-column prop="name" label="Role Name" align="center" width="220">
        </el-table-column>
        <!-- <el-table-column prop="grade" label="Grade" align="center">
        </el-table-column> -->
        <el-table-column prop="type" label="Jurisdiction" align="center">
        </el-table-column>
        <el-table-column label="Operations" align="center" v-slot="$props">
            <template>
                <el-button type="primary" size="small" @click="handleEdit($props.row,$props.$index)">Edit</el-button>
                <el-button type="danger" size="small" @click="handleDelete($props.$index)">Delete</el-button>
            </template>
        </el-table-column>
        </el-table>


        <el-dialog :title="form.id==0?'New Role':'Edit Role'" :visible.sync="dialogVisible" :before-close="handleClose">
        
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="Name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="Password">
            <el-input v-model="form.password"></el-input>
            </el-form-item> -->

            <!-- <el-form-item label="Menus">
            <el-radio-group v-model="form.grade">
                <el-radio label="First Estate"></el-radio>
                <el-radio label="Second level"></el-radio>
            </el-radio-group>
            </el-form-item> -->

            <el-form-item label="Menus">
            <el-checkbox-group v-model="form.type">
                <el-checkbox label="Dashboard" name="type" checked></el-checkbox>
                <el-checkbox label="Permission" name="type"></el-checkbox>
                <el-checkbox label="Customer Service" name="type"></el-checkbox>
                <el-checkbox label="Customer Profile" name="type"></el-checkbox>
                <el-checkbox label="Token Overview" name="type"></el-checkbox>
            </el-checkbox-group>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="onSubmit">Confirm</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
    return {
      rolesList: [
        {
            key: 1,
            name: 'admin',
            type:['Permission']
          }
      ],
      dialogVisible: false,
      form: {
          id:1,
          name: '',
          type: [],
        },
        index:0,
    }
  },
  methods:{
    empty(){
      var form = {
        id:1,
        name:'',
        type:[]
      }
      this.form = form;
    },
    handleAddRole(){
      this.empty();
      this.dialogVisible=true;
      this.form.id = 0;
    },
    handleClose() {
        this.dialogVisible = false;
    },
    onSubmit() {
      if(this.form.id==0){
        var id = this.rolesList[this.rolesList.length-1].key+1
        var data={
          key:id,
          name:this.form.name,
          grade:this.form.grade,
          type:this.form.type
        }
        this.rolesList.push(data);
      }else{
        this.rolesList[this.index].name = this.form.name;
        this.rolesList[this.index].grade = this.form.grade;
        this.rolesList[this.index].type = this.form.type;
      }

      
      this.dialogVisible = false;
    },
    handleDelete(index){
      this.rolesList.splice(index,1)
    },
    handleEdit(data,index){
      this.index = index;
      this.form.id = 2;
      this.dialogVisible=true;
      console.log(data);
      this.form.name=data.name;
      this.form.type = data.type;
    }
  }
}
</script>

<style scoped>
   .perssion_user{
       padding: 0 20px;
   }
   .el-button{
       margin-top: 30px;
   }
</style>