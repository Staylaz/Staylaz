<template>
  <div class="app-container">
    <div class="sub-navbar">
      <div class="left-part">
        <!-- v-model="contactType" class="contactTypeRadio" -->
        <el-radio-group>
          <el-radio-button label="All" />
          <el-radio-button label="Stranger" />
        </el-radio-group>

        <el-dropdown trigger="click">
          <el-button style="padding: 8px 10px" size="small" type="common">
            Filter by tag
            <i class="el-icon-caret-bottom el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item
              v-for="item of contactTypeOptions"
              :key="item.value"
              :disabled="contactType === item.value"
              :command="item.value"
            >
              {{ item.label }}
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <el-dropdown trigger="click">
        <el-button style="padding: 8px 10px" size="small" type="common">
          YOKA Hello
          <i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item
              v-for="item of contactTypeOptions"
              :key="item.value"
              :disabled="contactType === item.value"
              :command="item.value"
            >
              {{ item.label }}
            </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="customer-service-container">
      <contract-people-container />
      <chat-container />
      <resource-library-container />
    </div>
  </div>
</template>

<script>
// import { toggleClass } from '@/utils'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import ContractPeopleContainer from './contactPerson.vue'
import ChatContainer from './chat.vue'
import ResourceLibraryContainer from './resourceLibrary.vue'
export default {
  name: 'Theme',
  components: {
    ContractPeopleContainer,
    ChatContainer,
    ResourceLibraryContainer
  },
  data() {
    return {
      contactType: 'all',
      contactTypeOptions: {
        all: { label: 'All message', value: 'all' },
        stranger: { label: 'Stranger', value: 'stranger' }
      }
    }
  },
  watch: {},
  methods: {
    handleContactType(type) {
      this.contactType = type
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  overflow: hidden;
  height: 100vh;
  padding: 10px;
  padding-top: 4px;
}
.sub-navbar {
  display: flex;
  justify-content: space-between;
  .contactTypeRadio {
    margin-right: 20px;
  }
}

.customer-service-container {
  width: 100%;
  height: 100%;
  background-color: #f2f3f5;
  display: flex;
  justify-content: space-between;
}
</style>
