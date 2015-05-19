---
layout: doc-cs
---

Get Your Feet Wet with Breeze.sharp
-----------------------------------

If you're a .NET developer familiar with Visual Studio, here's the quickest way to get your feet wet with Breeze.sharp.  We'll build a WPF client application from scratch that accesses IdeaBlade's public **SampleService**.  <!--break--> This service supplies **TodoItem** entities used by our **Todo** sample application, each containing a **Description** field along with the date created and some other flags.  To keep thinks simple, we'll only retrieve the **Description** fields and display them in a WPF window.

1.  In Visual Studio, use the standard project template to create a new **WPFApplication** project.

2.  In the project's **Manage Nuget Packages** dialog, search online for and install the **Breeze.Sharp** package. Several additional dependencies will be automatically installed as well.  You'll need to accept a Microsoft license.

3.  Add a new class named **TodoItem** for the model of the entities we'll query from the server.  The name "TodoItem" corresponds to the name of the entity on the server.

	a.  Change the namespace to **Todo.Models**  (Again, this corresponds to the namespace used by the server)

	b.  Make the class **public**.

	c.  Make it inherit from **Breeze.Sharp.BaseEntity**

	d.  Add public properties for the **Id** (required because it's the primary key for the entity type) and **Description** fields (what we'll display):

		public int Id {
		get { return GetValue<int>(); }
		set { SetValue(value); }
		}
		
		public string Description {
		get { return GetValue<string>(); }
		set { SetValue(value); }
		}

	Note that we only need to include the key field (**Id**) and the subset of properties we're interested in.

4.	In the **MainWindow** class (the code-behind for MainWindow.xaml):

	a.  Add using statements for the **System.ComponentModel**, **Breeze.Sharp**, and **Todo.Models** namespaces

		using System.ComponentModel;
		using Breeze.Sharp;
		using Todo.Models;

	b.  Add the **INotifyPropertyChanged** interface to the class and let VS implement it (right click and select **Implement Interface**)

    	public partial class MainWindow : Window, INotifyPropertyChanged

	c.  Add an **Items** property that will expose the items we'll query:

    	// Bindable property
    	public IEnumerable<TodoItem> Items {
    		get { return _items; } 
    		set {
        		_items = value;
        		if (PropertyChanged != null) { 
            		PropertyChanged(this, new PropertyChangedEventArgs("Items"));
        		}
    		}
    	}
    	private IEnumerable<TodoItem> _items;

5.  Override the base BeginInit() method, adding the async keyword and invoke the base class method:

        public override async void BeginInit() {
            base.BeginInit();
	Within this method,

	a.  Set DataContext to this window to facilitate WPF binding.

	    DataContext = this;

	b.  Tell Breeze where to find our partial model of the TodoItem entity

        Configuration.Instance.ProbeAssemblies(typeof(TodoItem).Assembly);

	c.  Create an EntityManager and configure its metatdata store to allow use of our partial model

        // Create an EntityManager
        var entityManager = new EntityManager("http://sampleservice.breezejs.com/api/todos/");

        // Allow use of a partial model of server entities
        entityManager.MetadataStore.AllowedMetadataMismatchTypes = MetadataMismatchType.AllAllowable;

	d.  Invoke an **async** method to query the TodoItems and perform rudimentary error handling:

        // Query all TodoItems from the IdeaBlade-supplied public service
        Items = await QueryTodosFrom(entityManager);

6.	Create an **async** method to perform the query:

	    private async Task<IEnumerable<TodoItem>> QueryTodosFrom(EntityManager entityManager) {
	        try {
	            return await new EntityQuery<TodoItem>().Execute(entityManager);
	        }
	        catch (Exception e) {
	            MessageBox.Show(e.GetType().Name + ": " + e.Message);
	            return new TodoItem[0];
	        }
	    }

6.  In the **MainWindow.xaml** file add a **ListView** within the <Grid> element to display the Description fields of the queried items:

        <ListView ItemsSource="{Binding Items}" DisplayMemberPath="Description" />

7.  Build and run the application.  The list of six queried **Todo** items should appear in the main window.

Reference Code
--------------

Here's the complete code for the model in TodoItem.cs:


	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.Threading.Tasks;
	
	namespace Todo.Models
	{
	    public class TodoItem : Breeze.Sharp.BaseEntity {
	        public int Id {
	            get { return GetValue<int>(); }
	            set { SetValue(value); }
	        }
	
	        public string Description {
	            get { return GetValue<string>(); }
	            set { SetValue(value); }
	        }
	    }
	}
	
And here's the code behind in MainWindow.xaml.cs

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.Threading.Tasks;
	using System.Windows;
	using System.Windows.Controls;
	using System.Windows.Data;
	using System.Windows.Documents;
	using System.Windows.Input;
	using System.Windows.Media;
	using System.Windows.Media.Imaging;
	using System.Windows.Navigation;
	using System.Windows.Shapes;
	
	using System.ComponentModel;
	using Breeze.Sharp;
	using Todo.Models;
	
	namespace WpfApplication5
	{
	    /// <summary>
	    /// Interaction logic for MainWindow.xaml
	    /// </summary>
	    public partial class MainWindow : Window, INotifyPropertyChanged
	    {
	        public MainWindow() {
	            InitializeComponent();
	        }
	
	        public event PropertyChangedEventHandler PropertyChanged;
	
	        // Bindable property
	        public IEnumerable<TodoItem> Items {
	            get { return _items; }
	            set {
	                _items = value;
	                if (PropertyChanged != null) {
	                    PropertyChanged(this, new PropertyChangedEventArgs("Items"));
	                }
	            }
	        }
	        private IEnumerable<TodoItem> _items;
	
	        public override async void BeginInit() {
	            base.BeginInit();
	
	            DataContext = this;
	
	            Configuration.Instance.ProbeAssemblies(typeof(TodoItem).Assembly);
	
	            // Create an EntityManager
	            var entityManager = new EntityManager("http://sampleservice.breezejs.com/api/todos/");
	
	            // Allow use of a partial model of server entities
	            entityManager.MetadataStore.AllowedMetadataMismatchTypes = MetadataMismatchType.AllAllowable;
	
	            // Query all TodoItems from the IdeaBlade-supplied public service
	            Items = await QueryTodosFrom(entityManager);
	        }
	
	        private async Task<IEnumerable<TodoItem>> QueryTodosFrom(EntityManager entityManager) {
	            try {
	                return await new EntityQuery<TodoItem>().Execute(entityManager);
	            }
	            catch (Exception e) {
	                MessageBox.Show(e.GetType().Name + ": " + e.Message);
	                return new TodoItem[0];
	            }
	        }
	    }
	}
