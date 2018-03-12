<template>
  <div style="width:100%;">
    <div class="easy-table-header">
      <table class="easy-table" ref="theader">
        <colgroup>
          <col v-for="(col, index) in currentColumns" :key="index" :width="col.width">
        </colgroup>
        <thead style="width: 100%; ">
          <tr style="border-bottom: none;">
            <th v-for="(col, index) in columns" :key="index" :class="{'easy-h-border': hBorder, 'easy-v-border': vBorder}">
              <span>{{col.title}}</span>
              <div class="border-wrapper"></div>
              <a :class="{'on': col._sortType === 'asc'}" class="sort-flag" v-if="col.sortable" @click="handleSortByAsc(col.key), col._sortType ='asc'">↑</a>
              <a :class="{'on': col._sortType === 'desc'}" class="sort-flag" v-if="col.sortable" @click="handleSortByDesc(col.key) ,col._sortType ='desc'">↓</a>
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <div class="easy-table-body" style="height:100px; overflow-y: auto;">
      <table class="easy-table" ref="tbody">

        <tbody style="overflow-y: auto;height: 300px; width: 100%;">
          <tr v-for="(tr, index) in data" :key="index">
            <td 
            v-for="(td, _index) in tr" 
            :key="_index" 
            :class="{'easy-h-border': hBorder, 'easy-v-border': vBorder}"
            :colspan="data.length">{{td}}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>


<script>
import { cloneDeep } from "lodash";
export default {
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    height: {
      type: [Number, String],
      validator: (val) => {
        return val > 0;
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    vBorder: {
      type: Boolean,
      default: true
    },
    hBorder: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      drag: false,
      thBounding: null,
      thDragBorder: null,
      thTarget: null,
      currentData: [],
      currentColumns: []
    }
  },
  methods: {
    handleSortByAsc(key) {
        this.data.sort((a, b) => {
          return a[key] > b[key] ? 1 : -1;
        })
      },
      handleSortByDesc(key) {
        this.data.sort((a, b) => {
          return a[key] < b[key] ? 1 : -1;
        })
      },
      makeData() {
        this.currentData = cloneDeep(this.data);
        this.currentData = this.currentData.map((row, index) => {
          row._index = index;
          return row;
        })
      },
      makeColumns() {
        this.currentColumns = cloneDeep(this.columns);
        this.currentColumns = this.currentColumns.map((col, index) => {
          col._index = index;
          col._sortType = 'normal';
          return col;
        });
      },
      handleMouseDown(e){
        const target = e.target;
        if (target.className === 'border-wrapper') {
          e.preventDefault();
          this.thBounding = e.target.parentElement.getBoundingClientRect();
          this.drag = true;
          this.thTarget = e.target.parentElement; 
          document.body.style.cursor = 'ew-resize';
          this.thDragBorder = target;
          
          // this.currentColumns.forEach((item) => {
          //   item.width = '';
          // })
        }

      },
      handleMouseMove(e){
        if (this.drag) {
          e.preventDefault();
          window.requestAnimationFrame(function() {
            // console.log(this.thDragBorder);
            this.thDragBorder.style.right = -(e.clientX - this.thBounding.right) + 'px';
          }.bind(this))
        }
      },
      handleMouseUp(e){
        // console.log(e);
        // console.log(this.drag);
        if (this.drag === true) {
          this.drag = false;
          window.requestAnimationFrame(function () {
            const thTargetWidth = parseInt(window.getComputedStyle(this.thTarget).width);
            const thHeaderWidth = parseInt(window.getComputedStyle(this.$refs.theader).width);
            const varity = e.clientX - this.thBounding.right;
            this.thTarget.style.width = thTargetWidth + varity + 'px';
            this.$refs.theader.style.width = thHeaderWidth + varity + 'px';
            document.body.style.cursor = 'default';
            this.thDragBorder.style.right = '0px';
            this.thDragBorder.style.right = '0px';
          }.bind(this))
        }
      }

    },

    mounted() {
      this.makeData();
      this.makeColumns();
      console.log(this.$refs);
      document.addEventListener('mousedown', this.handleMouseDown.bind(document));
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    }
}
</script>

<style scoped>
  .on {
    color: red;
  }
  a:hover {
    cursor: pointer;
  }
  table {
    border-spacing: 0;
    border-collapse: collapse;
  }
  th,td {
    padding: 10px;
    margin: 0px;
    box-sizing: border-box;
  }
  .easy-v-border {
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  .easy-h-border {
    border-bottom: 1px solid #ccc;
    /* border-top: 1px solid #ccc; */
  }
  .easy-table-header .easy-h-border{
    border-top: 1px solid #ccc;
  }
  .sort-flag {
    user-select: none;
    font-size: 24px;
  }
  .easy-table {
    border: none;
    width: 100%;
    overflow-x: auto;
    
  }
  .easy-table-header th {
    position: relative;
  }
  .border-wrapper {
    position:absolute;
    height: 100%;
    width: 2px;
    right: 0px;
    top:0;
    border-right: 1px #000 dotted;
    opacity: 1;
  }
  .border-wrapper:hover {
    cursor: ew-resize;
  }

</style>


// style="overflow:scroll;" :style="{height: height ? height + 'px': 'auto'}"