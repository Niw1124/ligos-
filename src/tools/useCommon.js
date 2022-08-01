import { ref, computed, reactive } from "vue";
import { messageInfo } from "~/tools/messagePopup";
//列表，分页以及搜索   删除修改 的封装
export function useInitTable(opt = {}) {
  // //搜索
  // const searchForm = reactive({
  //   keyword: "",
  // });
  // //重置
  // const resetSearchForm = () => {
  //   searchForm.keyword = "";
  //   getData();
  // };
  let searchForm = null;
  let resetSearchForm = null;
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm });
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        resetSearchForm[key] = opt.searchForm[key];
      }
      getData();
    };
  }
  //储存角色列表

  const tableData = ref([]);

  const loading = ref(false);

  //分页部分
  const currentPage = ref(1);
  const total = ref(0);
  const limit = ref(10);

  function getData(p = null) {
    //p是点击下一页后的页数
    if (typeof p == "number") {
      currentPage.value = p;
    }
    loading.value = true;
    opt
      .getList(currentPage.value, searchForm)
      .then((res) => {
        if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
          opt.onGetListSuccess(res);
        } else {
          //这个才是通用的
          tableData.value = res.list;
          total.value = res.totalCount;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
  getData();

  //删除
  const handleDelete = (id) => {
    loading.value = true;
    opt
      .delete(id)
      .then((res) => {
        messageInfo("删除成功");
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  };
  //修改管理员状态
  const handleStatisChange = (status, row) => {
    row.statusLoading = true;
    opt
      .updateStatus(row.id, status)
      .then((res) => {
        messageInfo("修改状态成功");
        row.status = status;
      })
      .finally(() => {
        row.statusLoading = false;
      });
  };
  return {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatisChange,
  };
}

//新增修改的封装
export function useInitForm(opt = {}) {
  const editId = ref(0);
  const FormComponentRef = ref(null);
  const formRef = ref(null);
  const defaultForm = opt.form;
  const form = reactive({});
  const rules = opt.rules || {};
  const loading = ref(false);
  //将新增和修改区分开如果是0就是新增如果是当前id就是修改
  const drawerTitle = computed(() => {
    //如果editId有值就是修改如果没有就是新增
    editId.value ? "修改" : "新增";
  });
  //提交表单的方法
  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return;
      }
      FormComponentRef.value.showLoading();
      loading.value = true;

      const fun = editId.value
        ? opt.update(editId.value, form)
        : opt.create(form);
      fun
        .then((res) => {
          messageInfo(drawerTitle.value + "成功");
          //如果是修改就刷新当前页，如果是新增就刷新到第一页
          opt.getData(editId.value ? false : 1);
          FormComponentRef.value.close();
        })
        .finally(() => {
          FormComponentRef.value.hideLoading();
          loading.value = false;
        });
    });
  };
  //重置表单的方法
  function resetForm(row = false) {
    //如果能拿到表单节点，就清空它的校验规则的状态
    if (formRef.value) formRef.value.clearValidate();
    for (let key in defaultForm) {
      //让当前row的值赋给表单
      form[key] = row[key];
    }
  }
  //新增
  const handleCreateForm = () => {
    editId.value = 0;
    resetForm(defaultForm);
    FormComponentRef.value.open();
  };
  //修改编辑
  const handleEdit = (row) => {
    editId.value = row.id;
    resetForm(row);
    FormComponentRef.value.open();
  };

  return {
    editId,
    FormComponentRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    resetForm,
    handleCreateForm,
    handleEdit,
  };
}
