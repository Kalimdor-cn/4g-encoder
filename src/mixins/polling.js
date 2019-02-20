export default {
    data() {
        return {
            pollingTimer: null,
            pollingCount: 0
        }
    },
    methods: {
        beginPollingQuery() {
            let vm = this;
            vm.pollingTimer = setInterval(function () {
                vm.pollingCount++
                let isContinue = false
                vm.tableData.forEach(t => {
                    if (t.status == 2) {
                        isContinue = true;
                    }
                })
                if (vm.pollingCount > 12 || !isContinue) {
                    clearInterval(vm.pollingTimer);
                    vm.pollingTimer = null;
                    vm.pollingCount = 0
                    return;
                }
                vm.queryData(vm.paginationInfo.currentPage, vm.paginationInfo.pageSize);
            }, 5000)
        }
    },
    beforeDestroy() {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
        }
    }
}