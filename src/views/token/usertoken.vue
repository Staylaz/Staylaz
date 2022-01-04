<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.address"
        placeholder="User Address"
        style="width: 400px; margin-right: 10px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.sort"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="(item, index) in sortOptions"
          :key="index"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-switch
        v-model="tokenSwitch"
        style="margin-left: 20px"
        inactive-text="Main Token(DK)"
        active-text="Vice Token(DG)"
      >
      </el-switch>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Mint Time" min-width="400px" align="center">
        <template slot-scope="{ row }">
          <el-tag>{{ row.minttime | parseTimestamp }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Address" min-width="400px" align="center">
        <template slot-scope="{ row }">
          <span @click="toAddressBill(row.address)">{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="User Blance" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row[tokenBlance] | filterTokenAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="User Profit" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row[tokenProfit] | filterTokenAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="User Bought" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row[tokenBought] | filterTokenAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Price Bought" align="center" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row[tokenPriceIn] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Bought Times"
        class-name="status-col"
        min-width="150px"
      >
        <template slot-scope="{ row }">
          <el-tag type="success">{{ row[tokenBoughtTime] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="User Sell"
        class-name="status-col"
        min-width="150px"
      >
        <template slot-scope="{ row }">
          <span>{{ row[tokenSell] | filterTokenAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Price Sell"
        class-name="status-col"
        min-width="150px"
      >
        <template slot-scope="{ row }">
          <span> {{ row[tokenPriceOut] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Sell Times"
        class-name="status-col"
        min-width="150px"
      >
        <template slot-scope="{ row }">
          <el-tag type="danger"> {{ row[tokenSellTime] }} </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import tokenInfo from "@/api/token";
import waves from "@/directive/waves";
import Pagination from "@/components/Pagination";

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      tokenSwitch: false,
      listQuery: {
        page: 1,
        limit: 50,
        address: undefined,
        sort: "+balance",
      },
      sortOption: null,
      sortOptions: [
        { label: "Profit Asc", key: "+profit" },
        { label: "Profit Desc", key: "-profit" },
        { label: "Balance Asc", key: "+balance" },
        { label: "Balance Desc", key: "-balance" },
        { label: "Bought Time Asc", key: "+boughttime" },
        { label: "Bought Time Desc", key: "-boughttime" },
        { label: "Bought Num Asc", key: "+bought" },
        { label: "Bought Num Desc", key: "-bought" },
        { label: "Bought Price Asc", key: "+pricein" },
        { label: "Bought Price Desc", key: "-pricein" },
        { label: "Sell Time Asc", key: "+selltime" },
        { label: "Sell Time Desc", key: "-selltime" },
        { label: "Sell Num Asc", key: "+sell" },
        { label: "Sell Num Desc", key: "-sell" },
        { label: "Sell Price Asc", key: "+priceout" },
        { label: "Sell Price Desc", key: "-priceout" },
      ],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  computed: {
    tokenBlance() {
      return `${this.tokenType}balance`;
    },
    tokenProfit() {
      return `${this.tokenType}profit`;
    },
    tokenBought() {
      return `${this.tokenType}bought`;
    },
    tokenPriceIn() {
      return `${this.tokenType}pricein`;
    },
    tokenBoughtTime() {
      return `${this.tokenType}boughttime`;
    },
    tokenSell() {
      return `${this.tokenType}sell`;
    },
    tokenPriceOut() {
      return `${this.tokenType}priceout`;
    },
    tokenSellTime() {
      return `${this.tokenType}selltime`;
    },
    tokenType() {
      return !this.tokenSwitch ? "main" : "vice";
    },
  },
  watch: {
    tokenSwitch(newVal) {
      console.log(newVal);
    },
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      this.listLoading = true;
      tokenInfo
        .getHolders({ token: this.tokenType, ...this.listQuery })
        .then((res) => {
          let datas = res.data.data;
          let list = [];
          for (var i in datas) {
            list.push(datas[i]);
          }
          this.list = list;
          this.total = res.data.total;
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000);
        });
    },
    toAddressBill(address) {
      this.$router.push({
        name: "Bill",
        params: {
          address: address,
        },
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
  filters: {
    filterTokenAmount(value) {
      return value / 10 ** 3;
    },
    parseTimestamp(value) {
      let timestamp = value * 1000;
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();

      return `${year}-${month}-${day} ${hour}:${min}`;
    },
  },
};
</script>
