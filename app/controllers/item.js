class ItemController extends BaseController
{
    constructor()
    {
        super()
        this.displayAllItem()
    }

    async displayAllItem()
    {
        try
        {
            let content = ""
            const list = await this.model.getList(indexController.listId)
            const items = await this.model.getAllItemByList(list.id)
            $("#itemTitle").innerText = `Liste du ${list.date.toLocaleDateString()}`

            for(let item of items)
            {
                let checked = item.checked ? "checked" : ""
                content += `<tr>
                        <td>
                            <label>
                            <input type="checkbox" onchange="" ${checked}"/>
                            <span></span>
                            </label>
                        </td>
                        <td>${item.label}</td>
                        <td>${item.quantity}</td>
                        <td>
                            <button type="button" class="red darken-4 btn" onclick="itemController.displayConfirmDelete(${item.id})">
                            <i class="small material-icons">delete</i>
                            </button>
                        </td>
                        <td>
                            <button type="button" class="btn" onclick="itemController.edit(${item.id})">
                            <i class="small material-icons">edit</i>
                            </button>
                        </td>
                     </tr>`
            }
            $('#itemBodyTable').innerHTML = content
        }
        catch (e) {
            console.log(e)
            this.displayServiceError()
        }
    }

    async displayConfirmDelete(id)
    {
        try
        {
            const item = await this.model.getItem(id)
            super.displayConfirmDelete(item, async () => {
                switch (await this.model.deleteItem(id))
                {
                    case 200:
                        this.deletedItem = item
                        this.displayDeletedMessage("itemController.undoDelete()");
                        break
                    case 404:
                        this.displayNotFoundError();
                        break
                    case 500:
                        this.displayNotEmptyListError()
                        break
                    default:
                        this.displayServiceError()
                }
                this.displayAllItem()
            })
        }
        catch(e)
        {
            console.log(e)
            this.displayServiceError()
        }
    }

    async edit(id)
    {
        try
        {
            const object = await this.model.getItem(id)
            if (object === undefined)
            {
                this.displayServiceError()
                return
            }
            if (object === null)
            {
                this.displayNotFoundError()
                return
            }
            this.selectedItem = object
            $("#inputLabelUpdateItem").value = this.selectedItem.label
            $("#inputQuantityUpdateItem").value = this.selectedItem.quantity
            this.getModal("#updateItem").open()
            $("#inputQuantityUpdateItem").focus()
            $("#inputLabelUpdateItem").focus()
        }
        catch (err)
        {
            console.log(err)
            this.displayServiceError()
        }
    }

    newItem()
    {
        $("#inputLabelItem").value = ""
        $("#inputQuantityItem").value = ""
        $("#inputLabelItem").style.backgroundColor = ""
        $("#inputQuantityItem").style.backgroundColor = ""
        this.getModal("#addItem").open()
    }

    undoDelete()
    {
        if (this.deletedItem)
        {
            this.model.insertItem(this.deletedItem).then(status => {
                if (status === 200)
                {
                    this.deletedItem = null
                    this.displayUndoDone()
                    this.displayAllItem()
                }
            }).catch(_ => this.displayServiceError())
        }
    }
}

window.itemController = new ItemController()