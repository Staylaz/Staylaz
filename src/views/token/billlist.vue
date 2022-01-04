<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.txhash"
        placeholder="Transaction Hash"
        clearable
        style="width: 400px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.address"
        placeholder="User Address"
        clearable
        style="width: 300px; margin-right: 10px"
        class="filter-item"
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
      <el-select
        v-model="listQuery.action"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="(item, index) in actionOptions"
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
      <el-table-column
        label="Swap Date"
        class-name="status-col"
        min-width="150px"
      >
        <template slot-scope="{ row }">
          <el-tag>
            {{ (row.timestamp * 1000) | parseTime("{y}-{m}-{d} {h}:{i}") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Transaction Hash"
        min-width="400px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span @click="toTxhashDetail(row.txhash)">{{ row.txhash }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Address" min-width="300px" align="center">
        <template slot-scope="{ row }">
          <span @click="toAddressDetail(row.address)">{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.action == 1 ? 'success' : 'danger'">{{
            row.action == 0 ? "Sell" : "Buy"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Token Amount" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.tokenamount | filterTokenAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="BUSD Amount" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.busdamount | filterTokenAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Price" class-name="status-col" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Block Number"
        class-name="status-col"
        min-width="150px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.blocknum }}</span>
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
import { parseTime } from "@/utils";
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
        action: undefined,
        txhash: undefined,
        address: undefined,
        sort: "-timestamp",
      },
      sortOption: null,
      sortOptions: [
        { label: "Time Asc", key: "+timestamp" },
        { label: "Time Desc", key: "-timestamp" },
        { label: "Block Asc", key: "+blocknum" },
        { label: "Block Desc", key: "-blocknum" },
        { label: "Token Amount Asc", key: "+tokenamount" },
        { label: "Token Amount Desc", key: "-tokenamount" },
        { label: "BUSD Amount Asc", key: "+busdamount" },
        { label: "BUSD Amount Desc", key: "-busdamount" },
        { label: "Price Asc", key: "+price" },
        { label: "Price Desc", key: "-price" },
      ],
      actionOptions: [
        { id: 1, label: "All", key: undefined },
        { id: 2, label: "Sell", key: 0 },
        { id: 3, label: "Buy", key: 1 },
      ],
      dialogFormVisible: false,
      dialogStatus: "",

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
    let address =
      this.$route.params.address.length == 42
        ? this.$route.params.address
        : undefined;
    this.listQuery.address = address;
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      tokenInfo
        .getBill({ token: this.tokenType, ...this.listQuery })
        .then((res) => {
          let datas = res.data.data;
          let list = [];
          datas = JSON.parse(datas);
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
    toTxhashDetail(txhash) {
      window.open(`https://bscscan.com/tx/${txhash}`);
    },
    toAddressDetail(address) {
      window.open(`https://bscscan.com/address/${address}`);
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
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>
