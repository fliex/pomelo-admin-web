Ext.onReady(function(){

	Ext.BLANK_IMAGE_URL ='../ext-4.0.7-gpl/resources/themes/images/default/tree/s.gif'; 
	/**
	 * system monitor data store
	 * without the data 'networkInterfaces' 
	 */
	var sysStore = Ext.create('Ext.data.Store', {
		id:'sysStore',
		autoLoad:false,
		pageSize:5,
	    fields:['Time','hostname','serverId',
			'cpu_user','cpu_nice','cpu_system','cpu_iowait','cpu_steal','cpu_idle',
			'tps','kb_read','kb_wrtn','kb_read_per','kb_wrtn_per',
			'totalmem','freemem','free/total',
			'm_1','m_5','m_15',
		],
	//    groupField: 'department',
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json',
	            root: 'sysItems'
	        }
	    }
	});
	/**
	 * system's detailed  information
	 */
	var sysPanel = Ext.create('Ext.grid.Panel', {
		id:'gridPanelId',
	    // title: 'more information',
		region:'center',
	    store: sysStore,
	    autoScroll:true,
	    columns:[
			{xtype:'rownumberer',width:40,sortable:false},
			{text:'Time',width:120,sortable:false,dataIndex:'Time'},
			{text:'hostname',width:100,sortable:true,dataIndex:'hostname'},
			{text:'serverId',width:120,sortable:false,dataIndex:'serverId'},
			{text:'loadavg',
			 columns:[
				{text:'1m',width:60,sortable:true,dataIndex:'m_1'},
				{text:'5m',width:60,sortable:true,dataIndex:'m_5'},
				{text:'15m',width:60,sortable:true,dataIndex:'m_15'}
			 ]},
			  {text:'mem',
			 columns:[
				{text:'totalmem',width:70,sortable:true,dataIndex:'totalmem'},
				{text:'freemem',width:70,sortable:true,dataIndex:'freemem'},
				{text:'free/total',width:70,sortable:true,dataIndex:'free/total'}
			 ]},
			{text:'CPU(I/O)',
			 columns:[
				{text:'user',width:60,sortable:true,dataIndex:'cpu_user'},
				{text:'nice',width:60,sortable:true,dataIndex:'cpu_nice'},
				{text:'system',width:60,sortable:true,dataIndex:'cpu_system'},
				{text:'iowait',width:60,sortable:true,dataIndex:'cpu_iowait'},
				{text:'steal',width:60,sortable:true,dataIndex:'cpu_steal'},
				{text:'idle',width:60,sortable:true,dataIndex:'cpu_idle'}
			 ]},
			{text:'DISK(I/O)',
			 columns:[
				{text:'tps',width:70,sortable:true,dataIndex:'tps'},
				{text:'kb_read',width:70,sortable:true,dataIndex:'kb_read'},
				{text:'kb_wrtn',width:70,sortable:true,dataIndex:'kb_wrtn'},
				{text:'kb_read/s',width:70,sortable:true,dataIndex:'kb_read_per'},
				{text:'kb_wrtn/s',width:70,sortable:true,dataIndex:'kb_wrtn_per'}
			 ]}
		],
		tbar:[{
			xtype:'button',
			text:'refresh',
			handler:refresh
		 }]
	});

	/**
	 * the overall layout
	 */
	var viewport=new Ext.Viewport({
	    layout:'border',
	    items:[sysPanel]
	});

	refresh();
});

var refresh = function(){
	window.parent.client.request('systemInfo', null, function(err, msg) {
		if(err) {
			console.error('fail to request system info:');
			console.error(err);
			return;
		}

		// compose display data
		var data = [];
		for(var id in msg) {
			data.push(msg[id]);
		}
		var store = Ext.getCmp('gridPanelId').getStore();
		store.loadData(data);
	});
}

/*
 * update the data of gkPanel
 */
var contentUpdate = function(system, cpu, start_time){
    document.getElementById("system").innerHTML = system;
    document.getElementById("cpu").innerHTML = cpu;
    document.getElementById("start_time").innerHTML = start_time;
};