(function(){

	var $get=function(id){return document.getElementById(id)};

	var userHelper={
		
		userList:[],

		//获取性别
		getSex:function(){
			var sex="男";

			for(var i=0;i<document.getElementsByName('rdoSex').length;i++)
			{
				var item=document.getElementsByName('rdoSex')[i];
				if(item.checked)
				{
					return item.value;
				}
			}
			return sex;
		},
		
		//添加用户
		addUser:function(){

			//获取用户添加时填写的数据
			var userInfo={
				name:$get('txtName').value,
				age:parseInt($get('txtAge').value),
				sex:userHelper.getSex()
			};
			
			//验证用户信息，没问题才继续添加
			if(userHelper.checkUser(userInfo))
			{
				//往用户列表里增加一个用户
				userHelper.userList.push(userInfo);

				//重新绑定用户列表
				userHelper.bindList(true);
			}
		},

		//验证用户信息
		checkUser:function(userInfo){
			if(userInfo)
			{
				if(!userInfo.name)
				{
					alert("请填写姓名");
					return false;
				}
				if(!userInfo.age || userInfo.age<=0)
				{
					alert("请正确填写年龄")
					return false;
				}
				if(userInfo.sex!="男" && userInfo.sex!="女")
				{
					return false;
				}

			}
			else
			{
				alert("请填写用户信息");
				return false;
			}
			return true;
		},

		editUser:function(userInfo){
			//console.log("edit",userInfo);

			if(userHelper.userList[userInfo.index])
			{
				userHelper.userList[userInfo.index]={
					name:userInfo.name,
					age:userInfo.age,
					sex:userInfo.sex
				};
				userHelper.bindList(true);
			}

			alert("修改成功");

			//恢复到添加状态
			$get("txtName").value="";
			$get("txtAge").value="";

			$get('btnSubmit').style.display="block";
			$get('btnSave').style.display="none";
			document.getElementsByName('rdoSex')[0].checked=true;
			$get("txtName").focus();

		},

		//绑定修改用户信息
		showEditUser:function(userInfo){

			//把用户信息放入输入框
			$get('txtName').value=userInfo.name;
			$get('txtAge').value=userInfo.age;

			//性别的选择
			for(var i=0;i<document.getElementsByName('rdoSex').length;i++)
			{
				var item=document.getElementsByName('rdoSex')[i];
				if(item.value==userInfo.sex)
				{
					item.checked=true;
				}
			}

			//显示保存按钮
			$get('btnSubmit').style.display="none";
			$get('btnSave').style.display="block";

			//focus到姓名上
			$get('txtName').focus();

			//保存按钮事件
			$get('btnSave').onclick=function(){
				
				var _userInfo={
					index:userInfo.index,
					name:$get('txtName').value,
					age:parseInt($get('txtAge').value),
					sex:userHelper.getSex()
				};

				if(userHelper.checkUser(_userInfo))
				{
					//修改用户信息
					userHelper.editUser(_userInfo);
				}
			}

		},

		

		//删除用户
		delUser:function(index){
			if(confirm('确认要删除这个用户?'))
			{
				userHelper.userList=userHelper.userList.del(index);
				userHelper.bindList(true);
			}
		},

		//绑定用户列表
		bindList:function(isReferrshLocalStorage){

			if(isReferrshLocalStorage)
			{
				//更新localstroage
				localStorage["userList"]=JSON.stringify(userHelper.userList);
			}

			var html="";

			//遍历用户
			for(var i=0;i<this.userList.length;i++)
			{

				var userInfo=this.userList[i];
				html+="<tr>";
		        
				html+=['<th scope="row">'+(i+1)+'</th>',
					  	'<td>'+ userInfo.name +'</td>',
		          		'<td>'+ userInfo.age +'</td>',
		          		'<td>'+ userInfo.sex +'</td>',
		          		'<td class="controller" index="'+i+'" username="'+userInfo.name+'" userage="'+userInfo.age+'" usersex="'+userInfo.sex+'">',
		          		[
		          			'<a class="btnEdit" href="###">修改</a> | ', 
		          			'<a class="btnDel" href="###">删除</a>'
		          		].join(''),
		          		'</td>'
		          	  ].join('');
		        html+="</tr>";
			}

			//生成HTML后，赋值给列表重新显示
			$get('tblPersonList')
					.getElementsByTagName("tbody")[0]
					.innerHTML=html;


			for(var i=0;i<document.getElementsByClassName('controller').length;i++){

				var item=document.getElementsByClassName('controller')[i];

				//绑定事件
				item.onclick=function(){

					//获取绑定在节点上的用户信息
					var userInfo={
						index:parseInt(this.getAttribute("index")),
						name:this.getAttribute("username"),
						age:parseInt(this.getAttribute("userage")),
						sex:this.getAttribute("usersex")
					};

					//调用删除的方法
				 	if(event.target.className=="btnDel")
				 	{
				 		userHelper.delUser(userInfo.index);
				 	}

				 	//调用修改的方法
				 	else if(event.target.className=="btnEdit")
				 	{
				 		userHelper.showEditUser(userInfo);
				 	}
				};

			}

		},

		//初始化
		init:function(){

			//获取本地存储的值
			if(localStorage && localStorage["userList"])
			{
				this.userList=JSON.parse(localStorage["userList"]);
			}

			//绑定用户列表
			this.bindList();

			$get("txtName").focus();
		}
	};

	$get('btnSubmit').onclick=userHelper.addUser;
	userHelper.init();

	Array.prototype.del = function(n)
	{
		if (n<0) return this;
		return this.slice(0,n).concat(this.slice(n+1,this.length));
	}

})();