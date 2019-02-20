export default {
    data() {
        return {
            paginationInfo: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [5, 10, 20],
                total: 0
            }
        }
    },
    methods: {
        handleSizeChange(val) {
            this.queryData(1, val);
            this.paginationInfo.pageSize = val;
        },
        handleCurrentChange(val) {
            this.queryData(val, this.paginationInfo.pageSize);
        }
    }
}