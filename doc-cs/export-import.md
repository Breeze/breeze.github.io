---
layout: doc-cs
---

# Export and import entities

A mobile application may have to operate where connectivity is poor or non-existent. The user may push it into the background to make room for another application; the operating system could then evict the application from memory in a process called "tomb-stoning". A device could lose power, crash or reboot without warning.

A reliable, responsive application can save work to local storage and restore the data when the app is revived or re-launched.

In Breeze it's easy to export and re-import cached entities to any destination, including local storage or another `EntityManager`.

<p class="note">Entity export/import examples on this page are in the <strong>ExportImportTests.cs</strong> file in <a href="/breeze-sharp/samples" target="_blank">DocCode</a>. These tests are yours to explore and modify. Please send us your feedback and contributions.</p>

## Export cache as a string

The Breeze `EntityManager` can export some or all of its cached contents as [a serialized string](/breeze-sharp-documentation/entity-serialization "Entity Serialization"). Here's how to export its entire cache.

	var exportData = manager.ExportEntities();

The `exportData` value is a string serialization of every entity in the manager's cache plus the metadata for the entire model.

<p class="note">See the <a href="/breeze-sharp-documentation/metadata" target="_blank">metadata topic</a> for a discussion of the <code>MetadataStore</code>'s own export/import facilities.</p>

You are free to store that string anywhere, such as:

For desktop apps:

- file in local file system
- [Isolated Storage](http://msdn.microsoft.com/en-us/library/3ak841sy(v=vs.110).aspx) 

For browser apps:

- browser local storage
- browser global storage
- cloud storage
- <a href="http://brian.io/lawnchair/" target="_blank">lawnchair</a> &ndash; a popular mobile device storage library

Let's store it to a file under My Documents:

	var mydocpath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
    File.WriteAllText(mydocpath + @"\ExportEntities.txt", exportData);

Now let's store it in Isolated Storage:

	var isoStore = IsolatedStorageFile.GetStore(IsolatedStorageScope.User | IsolatedStorageScope.Assembly, null, null);
	using (var isoStream = new IsolatedStorageFileStream("ExportEntities.txt", FileMode.OpenOrCreate, isoStore))
	{
        using (var writer = new StreamWriter(isoStream))
        {
            writer.Write(exportData);
        }
    }

## Import to a manager

We can recover that serialized cache string later. Perhaps we'll re-launch the application and import it into a new `EntityManager`.

    using (var isoStream = new IsolatedStorageFileStream("ExportEntities.txt", FileMode.Open, isoStore))
    {
        using (var reader = new StreamReader(isoStream))
        {
            importData = reader.ReadToEnd();
        }
    }
	manager2.importEntities(importData);


If the second manager already has some of the same entities and those entities are in the "Unchanged" `EntityState`, the imported entities overwrite the cached entity values. The import will *not* overwrite a cached entity that has pending unsaved changes because the default `MergeStrategy` is `PreserveChanges`.

>More precisely, the default import `MergeStrategy` is the same as the default query `MergeStrategy` for this `EntityManager` instance. If you don't change the defaults, both query and import are governed by `MergeStrategy.PreserveChanges`. 

If you want to overwrite cached entities whether or not they have changes, pass in a configuration object as the second parameter and set the configuration's `mergeStrategy` to `MergeStrategy.OverwriteChanges` as seen in this example.

	manager2.ImportEntities(importData, new ImportOptions(MergeStrategy.OverwriteChanges));

## Export selected entities

You don't have to export the entire cache. You can specify selected entities to export. Here are some examples:

    var customers = manager.GetEntities<Customer>().ToList();

	var exportData1 = manager.ExportEntities(new IEntity[] {customers[0]}); // array with 1 customer

    var exportData2 = manager.ExportEntities(new IEntity[] {customers[0], customers[1]}); // array of 2 customers
	
    var exportData3 = manager.ExportEntities(manager.GetChanges()); // all pending changes

    var selectedCustomerQuery = new EntityQuery<Customer>().Where(customer => customer.CompanyName.StartsWith("P"));
    var selectedCustomers = manager.ExecuteQueryLocally(selectedCustomerQuery); // cache-only query returns synchronously
    var exportData4 = manager.ExportEntities(selectedCustomers); // the 'P' customers 

## Export without Metadata

By default the exported serialize data include the metadata for the entire model. That can be convenient.

But it's decidedly inconvenient when you want to export several cache subsets and hold them in browser local storage. The metadata portion of the serialized string could be many times the size of the entity data and you'll be repeating that metadata in each stash. You don't want to waste precious browser local storage with repeated stashes of metadata. 

The `EntityManager.ExportEntities` method has a second boolean parameter, "includeMetadata". It is optional and defaults to 'true'. Set this second parameter to `false` and the resulting export will be considerably smaller, containing only the data pertinent to the exported entities.

    manager.ExportEntities(entitiesToExport, false); // export without metadata


>The *ExportImportTests* in the <a href="/samples/doccode" target="_blank">DocCode</a> sample show a reduction from ~63,000 bytes to ~3000 bytes when exporting five entities. Your mileage may vary.

Entities exported without metadata **must be re-imported into an `EntityManager` that already contains the matching metadata** or else an exception will be thrown.

See the discussion below about <a href="#OfflineConsiderations">offline considerations</a>.

## Export to another manager

Many developers keep several managers around so they can isolate parallel workflows. For example, a user can edit customer 'A' in one manager and customer 'B' in a different manager and then cancel changes to 'A' without reverting pending changes to 'B'.

In such cases, you may need to flow entities from one manager to another. That's easy: export from one and import to the other:

    // export the selected entities without metadata
    var exportData = manager1.ExportEntities(selectedEntities, false);

	manager2.ImportEntities(exportData);

Remember that `manager2` must already have metadata before you import the entities. Pre-condition `manager2` to have the same metadata as `manager1` by creating it as an "empty copy" of `manager1`.

    // creates a new EntityManager with the same configuration as another EntityManager but without any entities
    var manager2 = new EntityManager(manager1);

## Multiple imports

You can import from several sources in succession. Each  import plays on top of the previous imports. For example, you might have saved stable reference entities under one name and held unsaved pending changes under another. When the application re-launches, you first pull in the references, then the pending changes, and then resume the user's editing session:

	using (var isoStream = new IsolatedStorageFileStream("references.txt", FileMode.Open, isoStore))
	{
	    using (var reader = new StreamReader(isoStream))
	    {
	        importData = reader.ReadToEnd();
	    }
	}
	manager.ImportEntities(importData);

	// retrieve via some storage key
	using (var isoStream = new IsolatedStorageFileStream("changes_2012100123121822123.txt", FileMode.Open, isoStore))
	{	
	    using (var reader = new StreamReader(isoStream))
	    {
	        importData = reader.ReadToEnd();
	    }
	} 
	manager.ImportEntities(importData);

## Importing new entities

You can export and import entities with pending changes -  changes that have yet to be saved to permanent storage.

There is a nuance regarding new entities whose keys are store-generated. Such entities have temporary keys until they are saved to the database; then the database provides permanent keys which breeze propagates back to the cached entities. The temporary keys are held in a key map that is part of the Breeze serialization format.

When Breeze imports such entities into a manager, the new entities *may be* assigned new temporary key values. This can happen if you import after shutting down and relaunching the application.

You should not assume that an imported entity will have the same temporary key as it had when it was exported.

A key value change could be necessary to prevent the temporary key of an imported new entity from conflicting with the temporary key value of an entity that is already in the target manager.

The following example may clarify the point.

    // Create a new Order. The Order key is store-generated.
    // Until saved, the new Order has a temporary key such as '-1'.
    var acme1 = manager1.CreateEntity<Order>(new {ShipName = "Acme"});

    // export without metadata
    var exported = manager1.ExportEntities(new IEntity[] {acme1}, false);

    // ... much time passes 
    // ... the client app is re-launched
    // ... the seed for the temporary id generator was reset
	
    // Create a new manager2 with metadata
    var manager2 = new EntityManager(manager1);

    // Add a new order to manager2
    // This new order has a temporary key.
    // That key could be '-1' ... the same key as acme1!!!
    var beta = (Order) manager2.CreateEntity(typeof (Order), new {ShipName = "Beta"});

    // Import the the exported acme1 from manager1
    // and get the newly merged instance from manager2
    var imported = manager2.ImportEntities(exported);
    var acme2 = imported.ImportedEntities.Cast<Order>().First();

    // compare the "same" order as it is in managers #1 and #2  
    var isSameName = acme1.ShipName == acme2.ShipName; // true

    // breeze had to update the acme key in manager2 because 'beta' already has ID==-1   
    var isSameId = acme1.OrderID == acme2.OrderID; // false; temporary keys are different

<a name="OfflineConsiderations"></a>
## Offline considerations

The ability to export reference entities and unsaved changes to local storage is especially useful in offline and mobile scenarios. Of course there is always a risk of losing data that exist only on the local device. When that risk is worth taking, you can often offer a substantial subset of application value while disconnected for extended periods.

In offline scenarios, considerable time (days? weeks?) may pass between the creation and storage of an export and the subsequent re-import of that data in a new manager.

What if there's been a change to the definition of the model in the interim? What if you update Breeze to a new version and that new version happens to incorporate a change to the Breeze metadata format? You probably won't be able to re-import the entities you exported and saved under the old metadata. 

What happens if you try to import entities exported with old metadata anyway? The import may fail in spectacular fashion by throwing an exception. Perhaps worse, it may fail silently, appearing to have succeeded while actually corrupting the entities in cache.

## Import version checking

> Note: The following is not yet available in Breeze#. 

You must keep track of metadata and model changes and take steps to  detect and recover when the imported data are "stale".

Recovery can be quite complicated and isn't covered here. Detection is more straight forward. 

There are many ways to confirm that the data you want to import are compatible with the current metadata. 

For example, you could combine your own application versioning information with the serialized export string before stashing it in local storage. Then you check the exported version with the current application version before importing it into an `EntityManager`

Breeze offers native support to do this same kind of thing.

The `MetadataStore` has a `name` property that you can set with any string value. Your application's model version is a good candidate:

	var metadataStoreName = "modelVersion: 1.2.3";
    manager.metadataStore.setProperties({
	    name: metadataStoreName
	});

>You could `JSON.stringify` the result of a more complex versioning scheme.

The `exportEntities` method records in the exported data both the version of the then-current-metadata-format (as "metadataVersion") and the `MetadataStore.name` property (as the "metadataStoreName").

Now you can configure the `importEntities` method to validate the import data before merging into cache as seen in this example:

    // export the entire cache without the metadata
    // the metadataVersion and metadataStoreName are captured
	var exported = manager.exportEntities(null, false); 

    // ... much time passes ...

    // try to import the stashed cache 
    try {
		var imported = manager.importEntities(exported, {
	                       metadataVersionFn: importValidationFn  
	                   }); 
    } catch (e) {
        /* good luck with your recovery plan */
    }

    // Detect when import is out-of-sync with current metadata or app model 
    function importValidationFn(cfg) {
        if (breeze.metadataVersion !== cfg.metadataVersion) {
            throw new Error(
                "Import breeze metadata version, " +
                cfg.metadataVersion +
                ", should be " + breeze.metadataVersion);
        }

        if (metadataStoreName !== cfg.metadataStoreName) {
            throw new Error(
                "Import application model version, " +
                cfg.metadataStoreName +
                ", should be " + metadataStoreName);
        }
    };
