<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index" style='padding-left:70px;'>
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    // import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-star-off',
                        index: '4G_encoder',
                        title: '4G编码器'
                    },
                    {
                        icon: 'el-icon-time',
                        index: '1',
                        title: '用户中心',
                        subs: [
                            {
                                index: 'userList',
                                title: '用户列表'
                            },
                            {
                                index: 'userInfo',
                                title: '用户信息'
                            },
                        ] 
                    },
                    {
                        icon: 'el-icon-upload2',
                        index: 'firmwareUpdate',
                        title: '固件升级'
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '2',
                        title: '配置参数管理',
                        subs: [
                            {
                                index: 'dispatchMana',
                                title: '配置派发管理'
                            },
                            {
                                index: 'uploadMana',
                                title: '配置上传管理'
                            },
                        ] 
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            
        }
    }
</script>

<style lang='scss' scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
        text-align: left;
        .el-menu.item [class^="el-icon-"]{
            margin-right: 5px;
            width: 24px;
            height: 24px;
            text-align: center;
            font-size: 18px;
            vertical-align: middle;
        }
        .el-submenu {
            &>.el-menu-item{
                padding-left: 80px;
            }
        }
        
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
