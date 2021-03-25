class BaseController
{
    constructor()
    {
        M.AutoInit();
        this.setBackButtonView('index')
        this.model = new Model()
    }

    toast(msg)
    {
        M.toast({html: msg, classes: 'rounded'})
    }

    displayServiceError()
    {
        this.toast('Service injoignable ou problème réseau')
    }

    getModal(selector)
    {
        return M.Modal.getInstance($(selector))
    }

    setBackButtonView(view)
    {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }

    displayConfirmDelete(object, onclick)
    {
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
        $('#spanDeleteObject').innerText = object.toString()
        $('#btnDelete').onclick = onclick
        this.getModal('#modalConfirmDelete').open()
    }

    displayNotFoundError()
    {
        this.toast('Entité inexistante')
    }

    displayNotEmptyListError()
    {
        this.toast('Impossible : La liste contient des ingrédients')
    }

    displayDeletedMessage(onUndo)
    {
        this.toast( `<span>Supression effectuée</span><button class="btn-flat toast-action" onclick="${onUndo}">Annuler</button>`)
    }

    displayUndoDone()
    {
        this.toast('Opération annulée')
    }
}
