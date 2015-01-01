var Entry = React.createClass({

  mixins: [OnClickOutside],

  getInitialState: function() {
    return {
      id: -1,
      title: "",
      created: Date.now(),
      published: Date.now(),
      updated: Date.now(),
      tags: [],
      editing: false,
      postdata: ""
    };
  },

  componentDidMount: function() {
    var state = this.props.metadata;
    state.postdata = this.props.postdata;
    this.setState(state);
    this.registerOutsideClickListener(this.view);
  },

  render: function() {
    var text = this.getText();
    var id = "gh-weblog-" + this.state.created;
    var idLink = "#" + id;
    var deletebutton;
    if(this.props.editable) {
      deletebutton = <button className="admin delete button" onClick={this.delete}>remove entry</button>;
    }
    var posted = (new Date(this.state.published)).toLocaleString();
    var updated = (new Date(this.state.updated)).toLocaleString();
    return (
      <div className="entry" id={id}>
        {deletebutton}
        <header>
          <h1><a href={idLink}>{this.state.title}</a></h1>
          <h2>Originally posted on {posted}, last updated on {updated}</h2>
        </header>
        <MarkDown ref="markdown" hidden={this.state.editing} text={this.state.postdata} onClick={this.edit} />
        <Editor ref="editor" hidden={!this.state.editing} text={text} update={this.update} view={this.view} delete={this.delete} />
        <Tags disabled={!this.props.editable} tags={this.state.tags} onChange={this.updateTags}/>
      </div>
    );
  },

  componentDidUpdate: function() {
    this.props.runProcessors(this.refs.markdown.getDOMNode());
  },

  updateTags: function(tags) {
    var self = this;
    this.setState({ tags: tags }, function() {
      this.props.onSave(self);
    });
  },

  getText: function() {
    return '#' + this.state.title + "\n\n" + this.state.postdata;
  },

  getMetaData: function() {
    var md = JSON.parse(JSON.stringify(this.state));
    delete md.editing;
    delete md.postdata;
    return md;
  },

  getPostData: function() {
    return this.state.postdata;
  },

  getHTMLData: function() {
    return this.refs.markdown.getHTML();
  },

  edit: function() {
    if(this.props.editable) {
      this.refs.editor.setText(this.getText());
      this.setState({ editing: true });
    }
  },

  update: function(evt) {
    var lines = evt.target.value.split("\n");
    var title = lines.splice(0,1)[0].replace(/^#*/,'');
    var postdata = lines.join("\n").trim();
    this.setState({
      title: title,
      postdata: postdata,
      updated: Date.now()
    });
  },

  view: function() {
    if(this.state.editing) {
      this.setState({ editing: false });
      this.props.onSave(this);
    }
  },

  delete: function() {
    this.props.onDelete(this);
  },

  // serialise this entry to RSS xml
  toRSS: function() {
    // ... code goes here ...
  }

});
